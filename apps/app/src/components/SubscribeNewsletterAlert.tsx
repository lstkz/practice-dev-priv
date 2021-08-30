import React from 'react';
import { useAuthActions, useUser } from 'src/features/AuthModule';
import { useErrorModalActions } from 'src/features/ErrorModalModule';
import { useLayoutEffectFix } from 'src/hooks/useLayoutEffectFix';
import { api } from 'src/services/api';
import { Alert } from './Alert';
import { Button } from './Button';

export function SubscribeNewsletterAlert() {
  const [isLoading, setIsLoading] = React.useState(false);
  const { showError } = useErrorModalActions();
  const [isSent, setIsSent] = React.useState(false);
  const [isForceHidden, setIsForceHidden] = React.useState(true);
  const user = useUser();
  const storageKey = `no_newsletter_banner_${user.id}`;
  const { updateUser } = useAuthActions();
  useLayoutEffectFix(() => {
    if (!localStorage[storageKey]) {
      setIsForceHidden(false);
    }
  }, []);
  if (isForceHidden || !user.isVerified || user.hasNewsletter) {
    return null;
  }
  return (
    <Alert
      type="info"
      onClose={() => {
        localStorage[storageKey] = new Date().toISOString();
        setIsForceHidden(true);
      }}
    >
      <div tw="sm:flex items-center ">
        Would you like to receive a newsletter about new content and features?
        <Button
          type="dark"
          size="xs"
          tw="ml-4"
          loading={isLoading}
          disabled={isSent}
          onClick={async () => {
            try {
              setIsLoading(true);
              await api.user_updateNotificationSettings({
                newsletter: true,
              });
              setIsSent(true);
              updateUser({
                ...user,
                hasNewsletter: true,
              });
            } catch (e) {
              showError(e);
            } finally {
              setIsLoading(false);
            }
          }}
        >
          {isSent ? 'Subscribed' : 'Subscribe'}
        </Button>
      </div>
    </Alert>
  );
}
