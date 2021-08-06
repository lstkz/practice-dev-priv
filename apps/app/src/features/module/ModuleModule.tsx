import React from 'react';
import { InferGetServerSidePropsType } from 'next';
import { useImmer, createModuleContext, useActions } from 'context-api';
import { ModulePage } from './ModulePage';
import { createGetServerSideProps } from '../../common/helper';

interface Actions {
  test: () => void;
}

interface State {
  foo: boolean;
}

const [Provider, useContext] = createModuleContext<State, Actions>();

export function ModuleModule(props: ModuleSSRProps) {
  const {} = props;
  const [state] = useImmer<State>(
    {
      foo: false,
    },
    'ModuleModule'
  );
  const actions = useActions<Actions>({
    test: () => {},
  });

  return (
    <Provider state={state} actions={actions}>
      <ModulePage />
    </Provider>
  );
}

export function useModuleActions() {
  return useContext().actions;
}

export function useModuleState() {
  return useContext().state;
}

export type ModuleSSRProps = InferGetServerSidePropsType<
  typeof getServerSideProps
>;

export const getServerSideProps = createGetServerSideProps(async _ctx => {
  return {
    props: {},
  };
});
