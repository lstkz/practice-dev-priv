import React from 'react';
import { InferGetServerSidePropsType } from 'next';
import { useImmer, createModuleContext, useActions } from 'context-api';
import { ProfilePage } from './ProfilePage';
import { createGetServerSideProps, createSSRClient } from '../../common/helper';
import { Activity, UserPublicProfile } from 'shared';
import { useErrorModalActions } from '../ErrorModalModule';
import { api } from 'src/services/api';

interface Actions {
  loadMoreActivity: () => void;
}

interface State {
  profile: UserPublicProfile;
  activity: {
    isLoadMore: boolean;
    total: number;
    items: Activity[];
  };
}

const [Provider, useContext] = createModuleContext<State, Actions>();

const ACTIVITY_PAGE_SIZE = 10;

export function ProfileModule(props: ProfileSSRProps) {
  const [state, setState, getState] = useImmer<State>(
    {
      profile: props.profile,
      activity: {
        isLoadMore: false,
        ...props.activity,
      },
    },
    'ProfileModule'
  );
  const { showError } = useErrorModalActions();
  const actions = useActions<Actions>({
    loadMoreActivity: async () => {
      try {
        setState(draft => {
          draft.activity.isLoadMore = true;
        });
        const result = await api.activity_searchActivities({
          username: props.profile.username,
          limit: ACTIVITY_PAGE_SIZE,
          offset: getState().activity.items.length,
        });
        setState(draft => {
          draft.activity.items.push(...result.items);
          draft.activity.total = result.total;
        });
      } catch (e) {
        showError(e);
      } finally {
        setState(draft => {
          draft.activity.isLoadMore = false;
        });
      }
    },
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
  const [profile, activity] = await Promise.all([
    api.user_getPublicProfile(username),
    api.activity_searchActivities({
      username,
      limit: ACTIVITY_PAGE_SIZE,
      offset: 0,
    }),
  ]);
  return {
    props: {
      profile,
      activity,
    },
  };
});
