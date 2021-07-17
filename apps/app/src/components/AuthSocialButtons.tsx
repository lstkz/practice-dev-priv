import { gql } from '@apollo/client';
import { useRouter } from 'next/dist/client/router';
import React from 'react';
import { useAuthForm } from 'src/hooks/useAuthForm';
import { GithubIcon } from '../icons/GithubIcon';
import { GoogleIcon } from '../icons/GoogleIcon';
import { Button } from './Button';
import {
  useLoginGithubMutation,
  useLoginGoogleMutation,
  useRegisterGithubMutation,
  useRegisterGoogleMutation,
} from '../generated';
import { useErrorModalActions } from 'src/features/ErrorModalModule';
import { GITHUB_CLIENT_ID, GOOGLE_CLIENT_ID } from 'src/config';

interface AuthSocialButtonsProps {
  source: 'login' | 'register';
  className?: string;
}

gql`
  mutation LoginGithub($code: String!) {
    loginGithub(code: $code) {
      ...DefaultAuthResult
    }
  }
  mutation RegisterGithub($code: String!) {
    registerGithub(code: $code) {
      ...DefaultAuthResult
    }
  }
  mutation LoginGoogle($accessToken: String!) {
    loginGoogle(accessToken: $accessToken) {
      ...DefaultAuthResult
    }
  }
  mutation RegisterGoogle($accessToken: String!) {
    registerGoogle(accessToken: $accessToken) {
      ...DefaultAuthResult
    }
  }
`;

export function AuthSocialButtons(props: AuthSocialButtonsProps) {
  const { source } = props;
  const router = useRouter();
  const [loginGithub] = useLoginGithubMutation();
  const [loginGoogle] = useLoginGoogleMutation();
  const [registerGithub] = useRegisterGithubMutation();
  const [registerGoogle] = useRegisterGoogleMutation();
  const errorModalActions = useErrorModalActions();
  const github = useAuthForm({
    submit: async () => {
      const code = router.query.code as string;
      if (source === 'login') {
        return loginGithub({
          variables: { code },
        }).then(x => x.data!.loginGithub);
      } else {
        return registerGithub({
          variables: { code },
        }).then(x => x.data!.registerGithub);
      }
    },
  });

  const google = useAuthForm({
    submit: async () => {
      const accessToken = /access_token=([^&]+)/.exec(
        window.location.hash
      )?.[1];
      if (!accessToken) {
        throw new Error('access_token missing');
      }
      if (source === 'login') {
        return loginGoogle({ variables: { accessToken } }).then(
          x => x.data!.loginGoogle
        );
      } else {
        return registerGoogle({ variables: { accessToken } }).then(
          x => x.data!.registerGoogle
        );
      }
    },
  });

  React.useEffect(() => {
    if (router.query.auth === 'github' && router.query.code) {
      void github.onSubmit();
    }
    if (router.query.auth === 'google') {
      void google.onSubmit();
    }
  }, [router.query]);

  React.useEffect(() => {
    if (github.error) {
      errorModalActions.show(github.error);
    }
  }, [github.error]);

  React.useEffect(() => {
    if (google.error) {
      errorModalActions.show(google.error);
    }
  }, [google.error]);

  const getRedirect = (auth: 'github' | 'google') => {
    const query = [`auth=${auth}`];
    return encodeURIComponent(
      window.location.origin + window.location.pathname + `?${query.join('&')}`
    );
  };
  return (
    <div {...props} tw="grid grid-cols-2 gap-3">
      <Button
        type="white"
        block
        loading={google.isSubmitting}
        onClick={() => {
          const params = [
            `client_id=${GOOGLE_CLIENT_ID}`,
            `redirect_uri=${getRedirect('google')}`,
            `scope=email`,
            `response_type=token`,
          ];
          window.location.href = `https://accounts.google.com/o/oauth2/auth?${params.join(
            '&'
          )}`;
        }}
      >
        <span className="sr-only">Sign in with Google</span>
        <GoogleIcon className="w-5 h-5" />
      </Button>
      <Button
        type="white"
        block
        loading={github.isSubmitting}
        onClick={() => {
          const params = [
            `client_id=${GITHUB_CLIENT_ID}`,
            `redirect_uri=${getRedirect('github')}`,
            `scope=${encodeURIComponent('user:email')}`,
          ];
          window.location.href = `https://github.com/login/oauth/authorize?${params.join(
            '&'
          )}`;
        }}
      >
        <span className="sr-only">Sign in with GitHub</span>
        <GithubIcon className="w-5 h-5" />
      </Button>
    </div>
  );
}
