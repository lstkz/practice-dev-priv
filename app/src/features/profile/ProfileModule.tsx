import React from 'react';
import { gql } from '@apollo/client';
import { InferGetServerSidePropsType } from 'next';
import { useImmer, createModuleContext, useActions } from 'context-api';
import { GetProfileDocument, GetProfileQuery } from '../../generated';
import { getApolloClient } from '../../getApolloClient';
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
  const [state, setState, getState] = useImmer<State>(
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

gql`
  query GetProfile {
    me {
      id
    }
  }
`;

export const getServerSideProps = createGetServerSideProps(async ctx => {
  const client = getApolloClient(ctx);
  // const ret = await client.query<GetProfileQuery>({
  //   query: GetProfileDocument,
  // });
  return {
    props: {},
  };
});
