import React from 'react';
import { gql } from '@apollo/client';
import { useImmer } from 'context-api';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useLoginMutation } from '../../generated';
import { ContextInput } from '../../components/ContextInput';
import { Button } from '../../components/Button';
import { Alert } from '../../components/Alert';
// import { useAuthActions } from '../../components/AuthModule';
import Link from 'next/link';
import { AuthSocialButtons } from '../../components/AuthSocialButtons';
import { Separator } from '../../components/Separator';
import { createUrl } from '../../common/url';
import { FullPageForm } from '../../components/FullPageForm';

type State = {
  error: string;
};

type FormValues = z.infer<typeof schema>;

const schema = z.object({
  username: z.string().nonempty({ message: 'This field is required.' }),
  password: z.string().nonempty({ message: 'This field is required.' }),
});

gql`
  mutation Login($loginValues: LoginInput!) {
    login(values: $loginValues) {
      ...DefaultAuthResult
    }
  }
`;

export function LoginPage() {
  const [state, setState] = useImmer<State>(
    {
      error: '',
    },
    'LoginModule'
  );
  const { error } = state;
  const formMethods = useForm<FormValues>({
    resolver: zodResolver(schema),
  });
  const { handleSubmit } = formMethods;
  const [, { loading }] = useLoginMutation();
  // const { loginUser } = useAuthActions();

  return (
    <FullPageForm
      title="Sign in to your account"
      bottom={
        <>
          Not Registered? Create an account{' '}
          <Link href={createUrl({ name: 'register' })}> here</Link>.
        </>
      }
    >
      <FormProvider {...formMethods}>
        <form
          tw="space-y-6"
          onSubmit={handleSubmit(async _values => {
            try {
              // const ret = await login({
              //   variables: values as any,
              // });
              // loginUser(ret.data!.login! as any);
              setState(draft => {
                draft.error = '';
              });
            } catch (e: any) {
              setState(draft => {
                draft.error = e.message;
              });
            }
          })}
        >
          {error && <Alert>{error}</Alert>}
          <ContextInput
            label="Username or Email"
            name="username"
            autoComplete="name"
          />
          <ContextInput
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
          />
          <Button type="primary" block htmlType="submit" loading={loading}>
            Sign in
          </Button>
          <div tw="flex items-center justify-end">
            <Link passHref href={createUrl({ name: 'forgot-password' })}>
              <a tw="font-medium text-indigo-600 hover:text-indigo-500 text-sm">
                Forgot your password?
              </a>
            </Link>
          </div>
        </form>
      </FormProvider>
      <Separator tw="mt-6">Or continue with</Separator>
      <AuthSocialButtons tw="mt-6" source="login" />
    </FullPageForm>
  );
}
