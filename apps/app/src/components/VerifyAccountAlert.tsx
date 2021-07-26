import { gql } from '@apollo/client';
import React from 'react';
import { useErrorModalActions } from 'src/features/ErrorModalModule';
import { useResendVerificationCodeMutation } from 'src/generated';
import { Alert } from './Alert';
import { Button } from './Button';

gql`
  mutation ResendVerificationCode {
    resendVerificationCode
  }
`;

export function VerifyAccountAlert() {
  const [resendVerificationCode, { loading }] =
    useResendVerificationCodeMutation();
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
          loading={loading}
          disabled={isSent}
          onClick={async () => {
            try {
              await resendVerificationCode();
              setIsSent(true);
            } catch (e) {
              showError(e);
            }
          }}
        >
          {isSent ? 'Sent' : 'Resend code'}
        </Button>
      </div>
    </Alert>
  );
}
