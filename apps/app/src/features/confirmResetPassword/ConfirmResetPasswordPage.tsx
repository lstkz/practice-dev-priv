import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { ContextInput } from '../../components/ContextInput';
import { Button } from '../../components/Button';
import { Alert } from '../../components/Alert';
import { FullPageForm } from '../../components/FullPageForm';
import { Validator } from 'src/common/Validator';
import { useAuthForm } from 'src/hooks/useAuthForm';
import { PASSWORD_MIN_LENGTH } from 'shared';
import { useRouter } from 'next/dist/client/router';
import { api } from 'src/services/api';

interface FormValues {
  password: string;
}

export function ConfirmResetPasswordPage() {
  const formMethods = useForm<FormValues>({
    resolver: data => {
      return new Validator(data)
        .required('password')
        .minLength('password', PASSWORD_MIN_LENGTH)
        .validate();
    },
  });
  const router = useRouter();
  const { error, isSubmitting, onSubmit } = useAuthForm({
    submit: () => {
      return api.user_confirmResetPassword(
        router.query.code as string,
        formMethods.getValues().password
      );
    },
  });
  const { handleSubmit } = formMethods;

  return (
    <FullPageForm title="Set New Password">
      <FormProvider {...formMethods}>
        <form tw="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {error && <Alert>{error}</Alert>}
          <ContextInput
            label="Password"
            name="password"
            type="password"
            autoComplete="new-password"
          />
          <Button type="primary" block htmlType="submit" loading={isSubmitting}>
            Change password
          </Button>
        </form>
      </FormProvider>
    </FullPageForm>
  );
}
