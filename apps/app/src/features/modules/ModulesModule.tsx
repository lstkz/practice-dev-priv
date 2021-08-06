import React from 'react';
import { InferGetServerSidePropsType } from 'next';
import { useImmer, createModuleContext, useActions } from 'context-api';
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
  const [state] = useImmer<State>(
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

export const getServerSideProps = createGetServerSideProps(async _ctx => {
  return {
    props: {},
  };
});
