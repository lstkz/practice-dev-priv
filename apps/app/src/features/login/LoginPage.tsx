import React from 'react';
import { gql } from '@apollo/client';
import { FormProvider, useForm } from 'react-hook-form';
import { useLoginMutation } from '../../generated';
import { ContextInput } from '../../components/ContextInput';
import { Button } from '../../components/Button';
import { Alert } from '../../components/Alert';
import Link from 'next/link';
import { AuthSocialButtons } from '../../components/AuthSocialButtons';
import { Separator } from '../../components/Separator';
import { createUrl } from '../../common/url';
import { FullPageForm } from '../../components/FullPageForm';
import { useAuthForm } from 'src/hooks/useAuthForm';
import { Validator } from 'src/common/Validator';

interface FormValues {
  usernameOrEmail: string;
  password: string;
}

gql`
  mutation Login($loginValues: LoginInput!) {
    login(values: $loginValues) {
      ...DefaultAuthResult
    }
  }
`;

export function LoginPage() {
  const formMethods = useForm<FormValues>({
    resolver: data => {
      return new Validator(data)
        .required('usernameOrEmail')
        .required('password')
        .validate();
    },
  });
  const [login] = useLoginMutation();
  const { error, isSubmitting, onSubmit } = useAuthForm({
    submit: () => {
      return login({
        variables: {
          loginValues: formMethods.getValues(),
        },
      }).then(x => x.data!.login!);
    },
  });
  const { handleSubmit } = formMethods;

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
        <form tw="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {error && <Alert>{error}</Alert>}
          <ContextInput
            label="Username or Email"
            name="usernameOrEmail"
            autoComplete="name"
          />
          <ContextInput
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
          />
          <Button type="primary" block htmlType="submit" loading={isSubmitting}>
            Sign in
          </Button>
          <div tw="flex items-center justify-end">
            <Link passHref href={createUrl({ name: 'reset-password' })}>
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
