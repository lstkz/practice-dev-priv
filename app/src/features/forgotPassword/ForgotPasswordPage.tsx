import React from 'react';
import { gql } from '@apollo/client';
import { useImmer } from 'context-api';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ContextInput } from '../../components/ContextInput';
import { Button } from '../../components/Button';
import { Alert } from '../../components/Alert';
import Link from 'next/link';
import { createUrl } from '../../common/url';
import { FullPageForm } from '../../components/FullPageForm';
import { MailIcon } from '@heroicons/react/outline';

type State = {
  error: string;
  isSuccess: boolean;
};

type FormValues = z.infer<typeof schema>;

const schema = z.object({
  username: z.string().nonempty({ message: 'This field is required.' }),
});

gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      ...DefaultAuthResult
    }
  }
`;

export function ForgotPasswordPage() {
  const [state, setState] = useImmer<State>(
    {
      error: '',
      isSuccess: false,
    },
    'ForgotPasswordModule'
  );
  const { error } = state;
  const formMethods = useForm<FormValues>({
    resolver: zodResolver(schema),
  });
  const { handleSubmit } = formMethods;
  const loading = false;

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
                setState(draft => {
                  draft.isSuccess = true;
                });
              } catch (e: any) {
                setState(draft => {
                  draft.error = e.message;
                });
              }
            })}
          >
            {error && <Alert>{error}</Alert>}
            <ContextInput label="Username or Email" name="username" />
            <Button type="primary" block htmlType="submit" loading={loading}>
              Reset password
            </Button>
          </form>
        </FormProvider>
      )}
    </FullPageForm>
  );
}
