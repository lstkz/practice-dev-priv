import React from 'react';
import { gql } from '@apollo/client';
import { InferGetServerSidePropsType } from 'next';
import { useImmer, createModuleContext, useActions } from 'context-api';
// import {
//   GetChallengeDocument,
//   GetChallengeQuery,
// } from '../../generated';
import { getApolloClient } from '../../getApolloClient';
import { ChallengePage } from './ChallengePage';
import { createGetServerSideProps } from '../../common/helper';

interface Actions {
  setChallengeTab: (challengeTab: ChallengeTab) => void;
}

interface State {
  challengeTab: ChallengeTab;
}

export type ChallengeTab =
  | 'details'
  | 'solutions'
  | 'test_suite'
  | 'submissions';

const [Provider, useContext] = createModuleContext<State, Actions>();

export function ChallengeModule(props: ChallengeSSRProps) {
  const {} = props;
  const [state, setState, getState] = useImmer<State>(
    {
      challengeTab: 'details',
    },
    'ChallengeModule'
  );
  const actions = useActions<Actions>({
    setChallengeTab: challengeTab => {
      setState(draft => {
        draft.challengeTab = challengeTab;
      });
    },
  });

  return (
    <Provider state={state} actions={actions}>
      <ChallengePage />
    </Provider>
  );
}

export function useChallengeActions() {
  return useContext().actions;
}

export function useChallengeState() {
  return useContext().state;
}

export type ChallengeSSRProps = InferGetServerSidePropsType<
  typeof getServerSideProps
>;

gql`
  query GetChallenge {
    me {
      id
    }
  }
`;

export const getServerSideProps = createGetServerSideProps(async ctx => {
  const client = getApolloClient(ctx);
  // const ret = await client.query<GetChallengeQuery>({
  //   query: GetChallengeDocument,
  // });
  return {
    // props: ret.data,
    props: {},
  };
});
