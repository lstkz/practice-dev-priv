import React from 'react';
import { useImmer } from 'context-api';
import { FormProvider, useForm } from 'react-hook-form';
import { ContextInput } from '../../components/ContextInput';
import { Button } from '../../components/Button';
import { Alert } from '../../components/Alert';
import Link from 'next/link';
import { createUrl } from '../../common/url';
import { FullPageForm } from '../../components/FullPageForm';
import { MailIcon } from '@heroicons/react/outline';
import { Validator } from 'src/common/Validator';
import { gql } from '@apollo/client';
import { useResetPasswordMutation } from '../../generated';
import { getErrorMessage } from 'src/common/helper';

type State = {
  error: string;
  isSuccess: boolean;
};

interface FormValues {
  usernameOrEmail: string;
}

gql`
  mutation ResetPassword($usernameOrEmail: String!) {
    resetPassword(usernameOrEmail: $usernameOrEmail)
  }
`;

export function ResetPasswordPage() {
  const [state, setState] = useImmer<State>(
    {
      error: '',
      isSuccess: false,
    },
    'ForgotPasswordModule'
  );
  const { error } = state;
  const [resetPassword, { loading }] = useResetPasswordMutation();
  const formMethods = useForm<FormValues>({
    resolver: data => {
      return new Validator(data).required('usernameOrEmail').validate();
    },
  });

  const { handleSubmit } = formMethods;

  return (
    <FullPageForm
      title="Reset your password"
      bottom={
        <>
          Not Registered? Create an account{' '}
          <Link href={createUrl({ name: 'register' })}> here</Link>.
        </>
      }
    >
      {state.isSuccess ? (
        <div>
          <div tw="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
            <MailIcon tw="h-8 w-8 text-green-600" aria-hidden="true" />
          </div>
          <div tw="text-center mt-3 text-gray-600">
            An email has been sent to your email address with further
            instruction how to reset your password. Please check your email.
          </div>
        </div>
      ) : (
        <FormProvider {...formMethods}>
          <form
            tw="space-y-6"
            onSubmit={handleSubmit(async values => {
              try {
                await resetPassword({
                  variables: values,
                });
                setState(draft => {
                  draft.isSuccess = true;
                });
              } catch (e: any) {
                setState(draft => {
                  draft.error = getErrorMessage(e);
                });
              }
            })}
          >
            {error && <Alert>{error}</Alert>}
            <ContextInput label="Username or Email" name="usernameOrEmail" />
            <Button type="primary" block htmlType="submit" loading={loading}>
              Reset password
            </Button>
          </form>
        </FormProvider>
      )}
    </FullPageForm>
  );
}
