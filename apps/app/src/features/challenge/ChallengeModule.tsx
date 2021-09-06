import React from 'react';
import { InferGetServerSidePropsType } from 'next';
import { useImmer, createModuleContext, useActions } from 'context-api';
import { ChallengePage } from './ChallengePage';
import {
  createGetServerSideProps,
  createSSRClient,
  doFn,
  getCDNUrl,
  safeAssign,
} from '../../common/helper';
import { readCookieFromString } from '../../common/cookie';
import {
  LEFT_COOKIE_NAME,
  LEFT_DEFAULT,
  RIGHT_COOKIE_NAME,
  RIGHT_DEFAULT,
} from './const';
import { EditorModule, EditorModuleRef } from './editor/EditorModule';
import { TesterModule } from './TesterModule';
import { ChallengeDetails, Solution, Submission, Workspace } from 'shared';
import { api } from 'src/services/api';
import { useSubAction } from '../PubSubContextModule';
import { useRouter } from 'next/dist/client/router';
import { createUrl } from 'src/common/url';

interface Actions {
  setLeftSidebarTab: (leftSidebarTab: LeftSidebarTab | null) => void;
  setRightSidebarTab: (rightSidebarTab: RightSidebarTab | null) => void;
  openSubmission: (submission: Submission) => Promise<void>;
  openSolution: (solution: Solution) => Promise<void>;
  closeReadOnlyWorkspace: () => void;
  fork: () => Promise<void>;
  resetWorkspace: () => void;
}

interface State {
  workspace: Workspace;
  challenge: ChallengeDetails;
  challengeHtml: string;
  initialLeftSidebar: number;
  initialRightSidebar: number;
  leftSidebarTab: LeftSidebarTab | null;
  rightSidebarTab: RightSidebarTab | null;
  openedSubmission: Submission | null;
  openedSolution: Solution | null;
}

export type LeftSidebarTab =
  | 'details'
  | 'file-explorer'
  | 'test-suite'
  | 'solutions'
  | 'submission-history';

export type RightSidebarTab = 'preview' | 'demo';

const [Provider, useContext] = createModuleContext<State, Actions>();

function useSyncSolutionUrl(
  challenge: ChallengeDetails,
  solution: Solution | null
) {
  const router = useRouter();

  React.useEffect(() => {
    const hasSolutionId = location.search.includes('solutionId');
    if (hasSolutionId && !solution) {
      void router.replace(
        createUrl({
          name: 'challenge',
          slug: challenge.slug,
        })
      );
    } else if (solution) {
      void router.replace(
        createUrl({
          name: 'challenge',
          slug: challenge.slug,
          solutionId: solution.id,
        })
      );
    }
  }, [solution]);
}

export function ChallengeModule(props: ChallengeSSRProps) {
  return <ChallengeModuleInner key={props.challenge.id} {...props} />;
}

function ChallengeModuleInner(props: ChallengeSSRProps) {
  const {
    initialLeftSidebar,
    initialRightSidebar,
    workspace,
    challenge,
    challengeHtml,
    initialSolution,
  } = props;
  const [state, setState, getState] = useImmer<State>(
    {
      challengeHtml,
      workspace,
      challenge,
      initialLeftSidebar,
      initialRightSidebar,
      leftSidebarTab: 'details',
      rightSidebarTab: 'preview',
      openedSubmission: null,
      openedSolution: initialSolution?.solution ?? null,
    },
    'ChallengeModule'
  );
  const editorRef = React.useRef<EditorModuleRef>(null!);
  const actions = useActions<Actions>({
    setLeftSidebarTab: leftSidebarTab => {
      setState(draft => {
        draft.leftSidebarTab = leftSidebarTab;
      });
    },
    setRightSidebarTab: rightSidebarTab => {
      setState(draft => {
        draft.rightSidebarTab = rightSidebarTab;
      });
    },
    openSubmission: async submission => {
      const workspace = await api.submission_getSubmissionReadonlyWorkspace(
        submission.id
      );
      editorRef.current.openReadOnlyWorkspace(workspace);
      setState(draft => {
        draft.openedSubmission = submission;
        draft.leftSidebarTab = 'file-explorer';
      });
    },
    closeReadOnlyWorkspace: () => {
      editorRef.current.closeReadOnlyWorkspace();
      setState(draft => {
        draft.openedSubmission = null;
        draft.openedSolution = null;
      });
    },
    fork: async () => {
      const { openedSubmission, openedSolution, workspace } = getState();
      const newWorkspace = openedSolution
        ? await api.solution_forkSolution(workspace.id, openedSolution!.id)
        : await api.submission_forkSubmission(
            workspace.id,
            openedSubmission!.id
          );
      editorRef.current.openNewWorkspace(newWorkspace);
      setState(draft => {
        draft.workspace = newWorkspace;
        draft.openedSubmission = null;
        draft.openedSolution = null;
      });
    },
    openSolution: async solution => {
      const workspace = await api.solution_getSolutionReadonlyWorkspace(
        solution.id
      );
      editorRef.current.openReadOnlyWorkspace(workspace);
      setState(draft => {
        draft.openedSolution = solution;
        draft.leftSidebarTab = 'file-explorer';
      });
    },
    resetWorkspace: async () => {
      const workspace = await api.workspace_resetWorkspace(
        getState().workspace.id
      );
      editorRef.current.openNewWorkspace(workspace);
      setState(draft => {
        draft.leftSidebarTab = 'file-explorer';
      });
    },
  });
  useSubAction({
    action: 'solution-vote-stats-updated',
    fn: ({ solutionId, result }) => {
      setState(draft => {
        if (draft.openedSolution?.id === solutionId) {
          safeAssign(draft.openedSolution, result);
        }
      });
    },
  });
  React.useEffect(() => {
    if (!initialSolution) {
      return;
    }
    editorRef.current.openReadOnlyWorkspace(initialSolution.solutionWorkspace);
  }, []);
  useSyncSolutionUrl(state.challenge, state.openedSolution);

  return (
    <Provider state={state} actions={actions}>
      <TesterModule challenge={challenge} workspace={workspace}>
        <EditorModule
          challenge={challenge}
          workspace={workspace}
          ref={editorRef}
          noWorkspaceInit={initialSolution != null}
        >
          <ChallengePage />
        </EditorModule>
      </TesterModule>
    </Provider>
  );
}

export function useChallengeActions() {
  return useContext().actions;
}

export function useChallengeState() {
  return useContext().state;
}

export type ChallengeSSRProps = InferGetServerSidePropsType<
  typeof getServerSideProps
>;

export const getServerSideProps = createGetServerSideProps(async ctx => {
  const getCookieNum = (name: string, defaultValue: number) => {
    const strVal = readCookieFromString(
      ctx?.req?.headers['cookie'] ?? '',
      name
    );
    const val = strVal ? Number(strVal) : null;
    return val || defaultValue;
  };
  const initialLeftSidebar = getCookieNum(LEFT_COOKIE_NAME, LEFT_DEFAULT);
  const initialRightSidebar = getCookieNum(RIGHT_COOKIE_NAME, RIGHT_DEFAULT);
  const solutionId = ctx.query.solutionId;
  const api = createSSRClient(ctx);
  const isLogged = api.hasToken();
  const moduleSlug = ctx.query.moduleSlug as string;
  const slug = ctx.query.slug as string;
  const challenge = await api.challenge_getChallenge({
    slug: moduleSlug + '/challenge/' + slug,
  });
  const [workspace, initialSolution] = await Promise.all([
    isLogged
      ? api.workspace_getOrCreateWorkspace({
          challengeId: challenge.id,
        })
      : null!,
    doFn(async () => {
      if (!solutionId || typeof solutionId !== 'string' || !isLogged) {
        return null;
      }
      const [solution, solutionWorkspace] = await Promise.all([
        api.solution_getSolution(solutionId),
        api.solution_getSolutionReadonlyWorkspace(solutionId),
      ]);
      return { solution, solutionWorkspace };
    }),
  ]);
  const challengeHtml = await fetch(getCDNUrl(challenge.htmlS3Key)).then(x =>
    x.text()
  );
  return {
    props: {
      challengeHtml,
      workspace,
      challenge,
      initialLeftSidebar,
      initialRightSidebar,
      initialSolution,
    },
  };
});
