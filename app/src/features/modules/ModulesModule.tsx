import React from 'react';
import { gql } from '@apollo/client';
import { InferGetServerSidePropsType } from 'next';
import { useImmer, createModuleContext, useActions } from 'context-api';
// import { GetModulesDocument, GetModulesQuery } from '../../generated';
import { getApolloClient } from '../../getApolloClient';
import { ModulesPage } from './ModulesPage';
import { createGetServerSideProps } from '../../common/helper';

interface Actions {
  test: () => void;
}

interface State {
  foo: boolean;
}

const [Provider, useContext] = createModuleContext<State, Actions>();

export function ModulesModule(props: ModulesSSRProps) {
  const {} = props;
  const [state, setState, getState] = useImmer<State>(
    {
      foo: false,
    },
    'ModulesModule'
  );
  const actions = useActions<Actions>({
    test: () => {},
  });

  return (
    <Provider state={state} actions={actions}>
      <ModulesPage />
    </Provider>
  );
}

export function useModulesActions() {
  return useContext().actions;
}

export function useModulesState() {
  return useContext().state;
}

export type ModulesSSRProps = InferGetServerSidePropsType<
  typeof getServerSideProps
>;

gql`
  query GetModules {
    me {
      id
    }
  }
`;

export const getServerSideProps = createGetServerSideProps(async ctx => {
  const client = getApolloClient(ctx);
  // const ret = await client.query<GetModulesQuery>({
  //   query: GetModulesDocument,
  // });
  return {
    // props: ret.data,
    props: {},
  };
});
