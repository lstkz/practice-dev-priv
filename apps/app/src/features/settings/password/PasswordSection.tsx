import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { SavableSection } from '../SavableSection';
import { ContextInput } from '../../../components/ContextInput';
import { gql } from '@apollo/client';
import { useChangePasswordMutation } from 'src/generated';
import { useErrorModalActions } from 'src/features/ErrorModalModule';
import { Validator } from 'src/common/Validator';
import { PASSWORD_MIN_LENGTH } from 'shared';

interface FormValues {
  password: string;
  confirmPassword: string;
}

gql`
  mutation ChangePassword($password: String!) {
    changePassword(password: $password)
  }
`;

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
  const [changePassword, { loading }] = useChangePasswordMutation();
  const { show: showError } = useErrorModalActions();
  return (
    <form
      onSubmit={handleSubmit(async values => {
        try {
          await changePassword({
            variables: values,
          });
          formMethods.reset();
        } catch (e) {
          showError(e);
        }
      })}
    >
      <SavableSection
        id="password-section"
        title="Password"
        isLoading={loading}
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
