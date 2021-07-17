import { Button } from '../../components/Button';
import React from 'react';
import {
  PASSWORD_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
  USERNAME_REGEX,
} from 'shared';
import { Separator } from '../../components/Separator';
import { AuthSocialButtons } from '../../components/AuthSocialButtons';
import { ContextInput } from 'src/components/ContextInput';
import { Validator } from 'src/common/Validator';
import { FormProvider, useForm } from 'react-hook-form';
import { useAuthForm } from 'src/hooks/useAuthForm';
import { gql } from '@apollo/client';
import { useRegisterMutation } from 'src/generated';
import { Alert } from 'src/components/Alert';

interface FormValues {
  email: string;
  username: string;
  password: string;
}

gql`
  mutation Register($registerValues: RegisterInput!) {
    register(values: $registerValues) {
      ...DefaultAuthResult
    }
  }
  fragment DefaultAuthResult on AuthResult {
    token
    user {
      ...allUserProps
    }
  }
`;

export function RegisterForm() {
  const formMethods = useForm<FormValues>({
    resolver: data => {
      return new Validator(data)
        .required('email')
        .email('email')
        .required('username')
        .regex(
          'username',
          USERNAME_REGEX,
          'Username may only contain alphanumeric characters or single hyphens, and cannot begin or end with a hyphen.'
        )
        .minLength('username', USERNAME_MIN_LENGTH)
        .maxLength('username', USERNAME_MAX_LENGTH)
        .required('password')
        .minLength('password', PASSWORD_MIN_LENGTH)
        .validate();
    },
  });
  const [register] = useRegisterMutation();
  const { error, isSubmitting, onSubmit } = useAuthForm({
    submit: () => {
      return register({
        variables: {
          registerValues: formMethods.getValues(),
        },
      }).then(x => x.data!.register!);
    },
  });

  return (
    <FormProvider {...formMethods}>
      <div tw="mt-16 sm:mt-12 lg:mt-0 lg:col-span-6">
        <div tw="bg-white sm:max-w-md sm:w-full sm:mx-auto sm:rounded-lg sm:overflow-hidden">
          <div tw="px-4 py-8 sm:px-10">
            <div>
              <p tw="text-sm font-medium text-gray-700">Sign up with</p>
              <AuthSocialButtons tw="mt-1" />
            </div>
            <Separator tw="mt-6">Or</Separator>
            <div tw="mt-6">
              <form tw="space-y-6" onSubmit={onSubmit}>
                {error && <Alert>{error}</Alert>}
                <ContextInput
                  label="Username"
                  name="username"
                  placeholder="Username"
                  noLabel
                  autoComplete="name"
                  limitMax
                />
                <ContextInput
                  label="Email"
                  name="email"
                  placeholder="Email"
                  noLabel
                  autoComplete="email"
                  limitMax
                />
                <ContextInput
                  label="Password"
                  name="password"
                  placeholder="Password"
                  type="Password"
                  noLabel
                  autoComplete="current-password"
                  limitMax
                />
                <div>
                  <Button type="primary" block loading={isSubmitting}>
                    Create your account
                  </Button>
                </div>
              </form>
            </div>
          </div>
          <div tw="px-4 py-6 bg-gray-50 border-t-2 border-gray-200 sm:px-10">
            <p tw="text-xs leading-5 text-gray-500">
              By signing up, you agree to our{' '}
              <a href="#" tw="font-medium text-gray-900 hover:underline">
                Terms
              </a>{' '}
              and{' '}
              <a href="#" tw="font-medium text-gray-900 hover:underline">
                Cookies Policy
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </FormProvider>
  );
}
