import React from 'react';
import { gql } from '@apollo/client';
import { InferGetServerSidePropsType } from 'next';
import { useImmer, createModuleContext, useActions } from 'context-api';
// import { getApolloClient } from '../../getApolloClient';
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
  const { initialLeftSidebar, initialRightSidebar, workspace } = props;
  const [state, setState] = useImmer<State>(
    {
      workspace,
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
  mutation GetOrCreateWorkspace {
    getOrCreateWorkspace(values: { challengeUniqId: "2_1" }) {
      id
      isReady
      items {
        id
        name
        parentId
        hash
        type
        url
      }
      s3Auth {
        bucketName
        credentials {
          accessKeyId
          secretAccessKey
          sessionToken
        }
      }
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
  const ret = await client.mutate<GetOrCreateWorkspaceMutation>({
    mutation: GetOrCreateWorkspaceDocument,
  });
  return {
    props: {
      workspace: ret.data!.getOrCreateWorkspace,
      initialLeftSidebar,
      initialRightSidebar,
    },
  };
});
