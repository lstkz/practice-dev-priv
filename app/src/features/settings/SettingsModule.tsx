import React from 'react';
import { gql } from '@apollo/client';
import { InferGetServerSidePropsType } from 'next';
import { useImmer, createModuleContext, useActions } from 'context-api';
import { GetSettingsDocument, GetSettingsQuery } from '../../generated';
import { getApolloClient } from '../../getApolloClient';
import { SettingsPage } from './SettingsPage';
import { createGetServerSideProps } from '../../common/helper';
import { profile } from 'node:console';

interface Actions {
  updateTab: (tab: SettingsTab) => void;
}

interface State {
  tab: SettingsTab;
}

export type SettingsTab =
  | 'profile'
  | 'account'
  | 'password'
  | 'notifications'
  | 'crypto';

const [Provider, useContext] = createModuleContext<State, Actions>();

export function SettingsModule(props: SettingsSSRProps) {
  const {} = props;
  const [state, setState, getState] = useImmer<State>(
    {
      tab: 'profile',
    },
    'SettingsModule'
  );
  const actions = useActions<Actions>({
    updateTab: tab => {
      setState(draft => {
        draft.tab = tab;
      });
    },
  });

  return (
    <Provider state={state} actions={actions}>
      <SettingsPage />
    </Provider>
  );
}

export function useSettingsActions() {
  return useContext().actions;
}

export function useSettingsState() {
  return useContext().state;
}

export type SettingsSSRProps = InferGetServerSidePropsType<
  typeof getServerSideProps
>;

gql`
  query GetSettings {
    me {
      id
    }
  }
`;

export const getServerSideProps = createGetServerSideProps(async ctx => {
  // const client = getApolloClient(ctx);
  // const ret = await client.query<GetSettingsQuery>({
  //   query: GetSettingsDocument,
  // });
  return {
    props: {},
  };
});
