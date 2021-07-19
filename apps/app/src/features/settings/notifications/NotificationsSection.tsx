import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { SavableSection } from '../SavableSection';
import {
  NotificationSettings,
  useUpdateNotificationSettingsMutation,
} from 'src/generated';
import { useErrorModalActions } from 'src/features/ErrorModalModule';
import { gql } from '@apollo/client';
import { ContextSwitchGroup } from 'src/components/ContextSwitchGroup';

interface NotificationsSectionProps {
  initialValues: NotificationSettings;
}

gql`
  mutation UpdateNotificationSettings($values: NotificationSettingsInput!) {
    updateNotificationSettings(values: $values) {
      newsletter
    }
  }
`;

export function NotificationsSection(props: NotificationsSectionProps) {
  const formMethods = useForm<NotificationSettings>({
    defaultValues: props.initialValues,
  });
  const { show: showError } = useErrorModalActions();
  const { handleSubmit } = formMethods;
  const [updateNotificationSettings, { loading }] =
    useUpdateNotificationSettingsMutation();

  return (
    <form
      onSubmit={handleSubmit(async values => {
        try {
          await updateNotificationSettings({
            variables: { values },
          });
        } catch (e) {
          showError(e);
        }
      })}
    >
      <SavableSection
        id="notifications-section"
        title="Email Notifications"
        isLoading={loading}
      >
        <FormProvider {...formMethods}>
          <div tw="space-y-6 mt-6 ">
            <ContextSwitchGroup
              name="newsletter"
              label="Newsletter"
              description="News about new functionality and new features. Zero spam!"
            />
          </div>
        </FormProvider>
      </SavableSection>
    </form>
  );
}
