import { Button } from '../../components/Button';
import React from 'react';
import { Separator } from '../../components/Separator';
import { AuthSocialButtons } from '../../components/AuthSocialButtons';
import { FormProvider } from 'react-hook-form';
import { Alert } from 'src/components/Alert';
import { useRegisterForm } from 'src/hooks/useRegisterForm';
import { RegisterContextFields } from 'src/components/RegisterContextFields';
import { createUrl } from 'src/common/url';
import Link from 'next/link';

export function RegisterForm() {
  const { formMethods, error, isSubmitting, onSubmit } = useRegisterForm();
  const { handleSubmit } = formMethods;
  return (
    <FormProvider {...formMethods}>
      <div tw="mt-16 sm:mt-12 lg:mt-0 lg:col-span-6">
        <div tw="bg-white sm:max-w-md sm:w-full sm:mx-auto sm:rounded-lg sm:overflow-hidden">
          <div tw="px-4 py-8 sm:px-10">
            <div>
              <p tw="text-sm font-medium text-gray-700">Sign up with</p>
              <AuthSocialButtons tw="mt-1" source="register" />
            </div>
            <Separator tw="mt-6">Or</Separator>
            <div tw="mt-6">
              <form tw="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                {error && <Alert>{error}</Alert>}
                <RegisterContextFields />
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
              <Link passHref href={createUrl({ name: 'terms' })}>
                <a tw="font-medium text-gray-900 hover:underline">Terms</a>
              </Link>{' '}
              and{' '}
              <Link passHref href={createUrl({ name: 'privacy' })}>
                <a tw="font-medium text-gray-900 hover:underline">
                  Privacy Policy
                </a>
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </FormProvider>
  );
}
