import React from 'react';
import { FormProvider } from 'react-hook-form';
import { Button } from '../../components/Button';
import { Alert } from '../../components/Alert';
import Link from 'next/link';
import { useRegisterForm } from 'src/hooks/useRegisterForm';
import { FullPageForm } from 'src/components/FullPageForm';
import { createUrl } from 'src/common/url';
import { Separator } from 'src/components/Separator';
import { AuthSocialButtons } from 'src/components/AuthSocialButtons';
import { RegisterContextFields } from 'src/components/RegisterContextFields';

export function RegisterPage() {
  const { formMethods, error, isSubmitting, onSubmit } = useRegisterForm();
  const { handleSubmit } = formMethods;
  return (
    <FullPageForm
      title="Create your account"
      bottom={
        <>
          Already registered? Log in
          <Link href={createUrl({ name: 'login' })}> here</Link>.
        </>
      }
    >
      <FormProvider {...formMethods}>
        <form tw="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {error && <Alert>{error}</Alert>}
          <RegisterContextFields />
          <Button type="primary" block htmlType="submit" loading={isSubmitting}>
            Sign up
          </Button>
        </form>
      </FormProvider>
      <Separator tw="mt-6">Or continue with</Separator>
      <AuthSocialButtons tw="mt-6" source="register" />
    </FullPageForm>
  );
}
