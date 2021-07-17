import React from 'react';
import { AuthData } from 'shared';
import { clearAccessToken, getErrorMessage } from 'src/common/helper';
import { useAuthActions } from 'src/features/AuthModule';

interface UseAuthFormOptions {
  redirectUrl?: string;
  submit: () => Promise<AuthData>;
}

export function useAuthForm(options: UseAuthFormOptions) {
  const { submit, redirectUrl } = options;
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState('');
  const authActions = useAuthActions();

  const onSubmit = async () => {
    setIsSubmitting(true);
    setError('');
    try {
      clearAccessToken();
      const ret = await submit();
      await authActions.loginUser(ret, redirectUrl);
    } catch (e) {
      setError(getErrorMessage(e));
      setIsSubmitting(false);
    }
  };

  return {
    error,
    isSubmitting,
    onSubmit,
  };
}
