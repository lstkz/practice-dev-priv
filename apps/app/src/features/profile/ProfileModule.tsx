import React from 'react';
import { InferGetServerSidePropsType } from 'next';
import { useImmer, createModuleContext, useActions } from 'context-api';
import { ProfilePage } from './ProfilePage';
import { createGetServerSideProps } from '../../common/helper';

interface Actions {
  test: () => void;
}

interface State {
  foo: boolean;
}

const [Provider, useContext] = createModuleContext<State, Actions>();

export function ProfileModule(props: ProfileSSRProps) {
  const {} = props;
  const [state] = useImmer<State>(
    {
      foo: false,
    },
    'ProfileModule'
  );
  const actions = useActions<Actions>({
    test: () => {},
  });

  return (
    <Provider state={state} actions={actions}>
      <ProfilePage />
    </Provider>
  );
}

export function useProfileActions() {
  return useContext().actions;
}

export function useProfileState() {
  return useContext().state;
}

export type ProfileSSRProps = InferGetServerSidePropsType<
  typeof getServerSideProps
>;

export const getServerSideProps = createGetServerSideProps(async _ctx => {
  return {
    props: {},
  };
});
