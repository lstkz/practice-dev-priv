import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { SavableSection } from '../SavableSection';
import { useErrorModalActions } from 'src/features/ErrorModalModule';
import { ContextSwitchGroup } from 'src/components/ContextSwitchGroup';
import { NotificationSettings } from 'shared';
import { api } from 'src/services/api';

interface NotificationsSectionProps {
  initialValues: NotificationSettings;
}

export function NotificationsSection(props: NotificationsSectionProps) {
  const formMethods = useForm<NotificationSettings>({
    defaultValues: props.initialValues,
  });
  const { show: showError } = useErrorModalActions();
  const { handleSubmit } = formMethods;
  const [isLoading, setIsLoading] = React.useState(false);

  return (
    <form
      onSubmit={handleSubmit(async values => {
        try {
          setIsLoading(true);
          await api.user_updateNotificationSettings(values);
        } catch (e) {
          showError(e);
        } finally {
          setIsLoading(false);
        }
      })}
    >
      <SavableSection
        id="notifications-section"
        title="Email Notifications"
        isLoading={isLoading}
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
