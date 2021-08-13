import React from 'react';
import { InferGetServerSidePropsType } from 'next';
import { useImmer, createModuleContext, useActions } from 'context-api';
import { ModulePage } from './ModulePage';
import { createGetServerSideProps, createSSRClient } from '../../common/helper';
import { Challenge, Module } from 'shared';

interface Actions {
  toggleFilter: (name: keyof ModulesFilter, value: any) => void;
}

export interface ModulesFilter {
  status: Array<'unattempted' | 'attempted' | 'solved'>;
  difficulty: string[];
}

interface State {
  module: Module;
  challenges: Challenge[];
  filter: ModulesFilter;
}

const [Provider, useContext] = createModuleContext<State, Actions>();

export function ModuleModule(props: ModuleSSRProps) {
  const {} = props;
  const [state, setState] = useImmer<State>(
    {
      module: props.module,
      challenges: props.challenges,
      filter: {
        status: [],
        difficulty: [],
      },
    },
    'ModuleModule'
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

export const getServerSideProps = createGetServerSideProps(async ctx => {
  const api = createSSRClient(ctx);
  const id = Number(ctx.query.id as string);
  const [module, searchResult] = await Promise.all([
    api.module_getModule(id),
    api.challenge_searchChallenges({ limit: 100, offset: 0, moduleId: id }),
  ]);
  return {
    props: {
      module,
      challenges: searchResult.items,
    },
  };
});
