import React from 'react';
import { useErrorModalActions } from 'src/features/ErrorModalModule';
import { api } from 'src/services/api';
import { Alert } from './Alert';
import { Button } from './Button';

export function VerifyAccountAlert() {
  const [isLoading, setIsLoading] = React.useState(false);
  const { showError } = useErrorModalActions();
  const [isSent, setIsSent] = React.useState(false);
  return (
    <Alert type="warning">
      <div tw="flex items-center">
        Please check your email and verify your account.
        <Button
          type="dark"
          size="xs"
          tw="ml-4"
          loading={isLoading}
          disabled={isSent}
          onClick={async () => {
            try {
              setIsLoading(true);
              await api.user_resendVerificationCode();
              setIsSent(true);
            } catch (e) {
              showError(e);
            } finally {
              setIsLoading(false);
            }
          }}
        >
          {isSent ? 'Sent' : 'Resend code'}
        </Button>
      </div>
    </Alert>
  );
}
