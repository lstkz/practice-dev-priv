import React from 'react';
import { gql } from '@apollo/client';
import { InferGetServerSidePropsType } from 'next';
import { useImmer, createModuleContext, useActions } from 'context-api';
import { ChallengePage } from './ChallengePage';
import { createGetServerSideProps } from '../../common/helper';
import { readCookieFromString } from '../../common/cookie';
import {
  LEFT_COOKIE_NAME,
  LEFT_DEFAULT,
  RIGHT_COOKIE_NAME,
  RIGHT_DEFAULT,
} from './const';
import { EditorModule } from './editor/EditorModule';
import { getApolloClient } from 'src/getApolloClient';
import {
  Challenge,
  GetChallengeDocument,
  GetChallengeQuery,
  GetOrCreateWorkspaceDocument,
  GetOrCreateWorkspaceMutation,
  Workspace,
} from 'src/generated';

interface Actions {
  setLeftSidebarTab: (leftSidebarTab: LeftSidebarTab | null) => void;
  setRightSidebarTab: (rightSidebarTab: RightSidebarTab | null) => void;
}

interface State {
  workspace: Workspace;
  challenge: Challenge;
  initialLeftSidebar: number;
  initialRightSidebar: number;
  leftSidebarTab: LeftSidebarTab | null;
  rightSidebarTab: RightSidebarTab | null;
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
  const { initialLeftSidebar, initialRightSidebar, workspace, challenge } =
    props;
  const [state, setState] = useImmer<State>(
    {
      workspace,
      challenge,
      initialLeftSidebar,
      initialRightSidebar,
      leftSidebarTab: 'details',
      rightSidebarTab: 'preview',
    },
    'ChallengeModule'
  );
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
  });

  return (
    <Provider state={state} actions={actions}>
      <EditorModule challengeId={1} workspace={workspace}>
        <ChallengePage />
      </EditorModule>
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

gql`
  mutation GetOrCreateWorkspace($id: String!) {
    getOrCreateWorkspace(values: { challengeUniqId: $id }) {
      id
      isReady
      items {
        id
        name
        parentId
        hash
        type
        isLocked
      }
      s3Auth {
        bucketName
        credentials {
          accessKeyId
          secretAccessKey
          sessionToken
        }
      }
      libraries {
        name
        types
        source
      }
    }
  }
`;

gql`
  query GetChallenge($id: String!) {
    getChallenge(id: $id) {
      challengeId
      moduleId
      title
      description
      difficulty
      practiceTime
      detailsS3Key
      htmlS3Key
      solutionUrl
    }
  }
`;

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

  const client = getApolloClient(ctx);
  const [workspace, challenge] = await Promise.all([
    client
      .mutate<GetOrCreateWorkspaceMutation>({
        mutation: GetOrCreateWorkspaceDocument,
        variables: {
          id: '2_1',
        },
      })
      .then(x => x.data!.getOrCreateWorkspace),
    client
      .query<GetChallengeQuery>({
        query: GetChallengeDocument,
        variables: {
          id: '2_1',
        },
      })
      .then(x => x.data.getChallenge),
  ]);
  return {
    props: {
      workspace,
      challenge,
      initialLeftSidebar,
      initialRightSidebar,
    },
  };
});
