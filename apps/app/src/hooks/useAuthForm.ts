import React from 'react';
import { AuthData } from 'shared';
import { getErrorMessage } from 'src/common/helper';
import { useAuthActions } from 'src/features/AuthModule';
import { clearAccessToken } from 'src/services/Storage';

interface UseAuthFormOptions {
  submit: () => Promise<AuthData>;
}

export function useAuthForm(options: UseAuthFormOptions) {
  const { submit } = options;
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState('');
  const authActions = useAuthActions();

  const onSubmit = async (e?: React.FormEvent<any>) => {
    if (e) {
      e.preventDefault();
    }
    setIsSubmitting(true);
    setError('');
    try {
      clearAccessToken();
      const ret = await submit();
      await authActions.loginUser(ret);
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
