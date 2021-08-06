import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { SavableSection } from '../SavableSection';
import { ContextInput } from '../../../components/ContextInput';
import { useErrorModalActions } from 'src/features/ErrorModalModule';
import { Validator } from 'src/common/Validator';
import { PASSWORD_MIN_LENGTH } from 'shared';
import { api } from 'src/services/api';

interface FormValues {
  password: string;
  confirmPassword: string;
}

export function PasswordSection() {
  const formMethods = useForm<FormValues>({
    resolver: data => {
      return new Validator(data)
        .required('password')
        .minLength('password', PASSWORD_MIN_LENGTH)
        .required('confirmPassword')
        .custom('confirmPassword', values =>
          values.confirmPassword !== values.password
            ? "Passwords don't match."
            : null
        )
        .validate();
    },
  });
  const { handleSubmit } = formMethods;
  const [isLoading, setIsLoading] = React.useState(false);
  const { show: showError } = useErrorModalActions();
  return (
    <form
      onSubmit={handleSubmit(async values => {
        try {
          setIsLoading(true);
          await api.user_changePassword(values.password);
          formMethods.reset();
        } catch (e) {
          showError(e);
        } finally {
          setIsLoading(false);
        }
      })}
    >
      <SavableSection
        id="password-section"
        title="Password"
        isLoading={isLoading}
      >
        <FormProvider {...formMethods}>
          <div tw="space-y-6 mt-6 ">
            <ContextInput
              label="New password"
              name="password"
              type="password"
            />
            <ContextInput
              label="Confirm new password"
              name="confirmPassword"
              type="password"
            />
          </div>
        </FormProvider>
      </SavableSection>
    </form>
  );
}
