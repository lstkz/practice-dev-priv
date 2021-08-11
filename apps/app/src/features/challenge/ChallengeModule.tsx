import React from 'react';
import { InferGetServerSidePropsType } from 'next';
import { useImmer, createModuleContext, useActions } from 'context-api';
import { ChallengePage } from './ChallengePage';
import {
  createGetServerSideProps,
  createSSRClient,
  getCDNUrl,
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
import { Challenge, Solution, Submission, Workspace } from 'shared';
import { api } from 'src/services/api';

interface Actions {
  setLeftSidebarTab: (leftSidebarTab: LeftSidebarTab | null) => void;
  setRightSidebarTab: (rightSidebarTab: RightSidebarTab | null) => void;
  openSubmission: (submission: Submission) => Promise<void>;
  openSolution: (solution: Solution) => Promise<void>;
  closeReadOnlyWorkspace: () => void;
  fork: () => void;
}

interface State {
  workspace: Workspace;
  challenge: Challenge;
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

export function ChallengeModule(props: ChallengeSSRProps) {
  const {
    initialLeftSidebar,
    initialRightSidebar,
    workspace,
    challenge,
    challengeHtml,
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
      openedSolution: null,
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
  });

  return (
    <Provider state={state} actions={actions}>
      <TesterModule challenge={challenge} workspace={workspace}>
        <EditorModule
          challenge={challenge}
          workspace={workspace}
          ref={editorRef}
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

  const api = createSSRClient(ctx);
  const [workspace, challenge] = await Promise.all([
    api.workspace_getOrCreateWorkspace({
      challengeUniqId: '2_1',
    }),
    api.challenge_getChallenge('2_1'),
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
    },
  };
});
