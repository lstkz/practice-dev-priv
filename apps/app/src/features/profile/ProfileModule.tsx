import React from 'react';
import { InferGetServerSidePropsType } from 'next';
import { useImmer, createModuleContext, useActions } from 'context-api';
import { ProfilePage } from './ProfilePage';
import { createGetServerSideProps, createSSRClient } from '../../common/helper';
import { UserPublicProfile } from 'shared';

interface Actions {
  test: () => void;
}

interface State {
  profile: UserPublicProfile;
}

const [Provider, useContext] = createModuleContext<State, Actions>();

export function ProfileModule(props: ProfileSSRProps) {
  const [state] = useImmer<State>(
    {
      profile: props.profile,
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

export const getServerSideProps = createGetServerSideProps(async ctx => {
  const api = createSSRClient(ctx);
  const username = ctx.query.username as string;
  const profile = await api.user_getPublicProfile(username);
  return {
    props: {
      profile,
    },
  };
});
