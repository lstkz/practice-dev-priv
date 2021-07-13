import React from 'react';
import { GithubIcon } from '../icons/GithubIcon';
import { GoogleIcon } from '../icons/GoogleIcon';
import { Button } from './Button';

interface AuthSocialButtonsProps {
  className?: string;
}

export function AuthSocialButtons(props: AuthSocialButtonsProps) {
  return (
    <div {...props} tw="grid grid-cols-2 gap-3">
      <Button type="white" block>
        <span className="sr-only">Sign in with Google</span>
        <GoogleIcon className="w-5 h-5" />
      </Button>

      <Button type="white" block>
        <span className="sr-only">Sign in with GitHub</span>
        <GithubIcon className="w-5 h-5" />
      </Button>
    </div>
  );
}
