import React from 'react';
import { InferGetServerSidePropsType } from 'next';
import { useImmer, createModuleContext, useActions } from 'context-api';
import { ModulesPage } from './ModulesPage';
import { createGetServerSideProps, createSSRClient } from '../../common/helper';
import { Module } from 'shared';

interface Actions {
  toggleFilter: (name: keyof ModulesFilter, value: any) => void;
}

export interface ModulesFilter {
  status: Array<'unattempted' | 'attempted'>;
  technology: string[];
  difficulty: string[];
}

interface State {
  modules: Module[];
  filter: ModulesFilter;
}

const [Provider, useContext] = createModuleContext<State, Actions>();

export function ModulesModule(props: ModulesSSRProps) {
  const [state, setState] = useImmer<State>(
    {
      modules: props.modules,
      filter: {
        status: [],
        technology: [],
        difficulty: [],
      },
    },
    'ModulesModule'
  );
  const actions = useActions<Actions>({
    toggleFilter: (name, value) => {
      setState(draft => {
        const idx = draft.filter[name].indexOf(value);
        if (idx !== -1) {
          draft.filter[name].splice(idx, 1);
        } else {
          draft.filter[name].push(value);
        }
      });
    },
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

export const getServerSideProps = createGetServerSideProps(async ctx => {
  const api = createSSRClient(ctx);
  const result = await api.module_searchModules({ limit: 100, offset: 0 });
  return {
    props: {
      modules: result.items,
    },
  };
});
