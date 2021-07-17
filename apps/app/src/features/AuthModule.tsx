import React from 'react';
import { useImmer, createModuleContext, useActions } from 'context-api';
import { AuthResult, useLogoutMutation, User } from '../generated';
import { clearAccessToken, setAccessToken } from '../common/helper';
import { useRouter } from 'next/dist/client/router';
import { createUrl } from 'src/common/url';
import { gql } from '@apollo/client';

interface Actions {
  logout: () => void;
  loginUser: (data: AuthResult, redirectUrl?: string) => void;
}

interface State {
  user: User | null;
}

const [Provider, useContext] = createModuleContext<State, Actions>();

export interface AuthProps {
  children: React.ReactNode;
  initialUser: User | null;
}

gql`
  mutation Logout {
    logout
  }
`;

export function AuthModule(props: AuthProps) {
  const { children, initialUser } = props;
  const [state, setState] = useImmer<State>(
    {
      user: initialUser,
    },
    'AuthModule'
  );
  const router = useRouter();
  const [logout] = useLogoutMutation();
  const actions = useActions<Actions>({
    logout: () => {
      void logout()
        .catch(() => {})
        .then(() => {
          clearAccessToken();
          return router.push('/');
        });
    },
    loginUser: (data, redirectUrl) => {
      setAccessToken(data.token);
      setState(draft => {
        draft.user = data.user;
      });
      void router.push(redirectUrl ?? createUrl({ name: 'modules' }));
    },
  });

  return (
    <Provider state={state} actions={actions}>
      {children}
    </Provider>
  );
}

export function useAuthActions() {
  return useContext().actions;
}

export function useAuthState() {
  return useContext().state;
}
export function useUser() {
  return useAuthState().user!;
}
