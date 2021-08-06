import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { SavableSection } from '../SavableSection';
import { ContextInput } from '../../../components/ContextInput';
import { Validator } from 'src/common/Validator';
import {
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
  USERNAME_REGEX,
} from 'shared';
import { useAuthActions, useUser } from 'src/features/AuthModule';
import { useErrorModalActions } from 'src/features/ErrorModalModule';
import { api } from 'src/services/api';

interface FormValues {
  username: string;
}

export function AccountUsernameSection() {
  const user = useUser();
  const { updateUser } = useAuthActions();
  const formMethods = useForm<FormValues>({
    defaultValues: {
      username: user.username,
    },
    resolver: data => {
      return new Validator(data)
        .required('username')
        .regex(
          'username',
          USERNAME_REGEX,
          'Username may only contain alphanumeric characters or single hyphens, and cannot begin or end with a hyphen.'
        )
        .minLength('username', USERNAME_MIN_LENGTH)
        .maxLength('username', USERNAME_MAX_LENGTH)
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
          await api.user_changeUsername(values.username);
          updateUser({
            username: values.username,
          });
        } catch (e) {
          showError(e);
        } finally {
          setIsLoading(false);
        }
      })}
    >
      <SavableSection
        id="username-section"
        title="Username"
        desc="Be careful when changing the username, someone can take your old username."
        isLoading={isLoading}
      >
        <FormProvider {...formMethods}>
          <div tw="space-y-6 mt-6 ">
            <ContextInput label="Username" name="username" />
          </div>
        </FormProvider>
      </SavableSection>
    </form>
  );
}
