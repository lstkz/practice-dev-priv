import React from 'react';
import { gql } from '@apollo/client';
import { useImmer } from 'context-api';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useLoginMutation } from '../../generated';
import { ContextInput } from '../../components/ContextInput';
import { Button } from '../../components/Button';
import { Alert } from '../../components/Alert';
import { useAuthActions } from '../../components/AuthModule';
import { FullPageForm } from '../../components/FullPageForm';

type State = {
  error: string;
};

type FormValues = z.infer<typeof schema>;

const schema = z.object({
  password: z.string().nonempty({ message: 'This field is required.' }),
  confirmPassword: z.string().nonempty({ message: 'This field is required.' }),
});

gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      ...DefaultAuthResult
    }
  }
`;

export function ResetPasswordPage() {
  const [state, setState] = useImmer<State>(
    {
      error: '',
    },
    'ResetPasswordModule'
  );
  const { error } = state;
  const formMethods = useForm<FormValues>({
    resolver: zodResolver(schema),
  });
  const { handleSubmit } = formMethods;
  const [login, { loading }] = useLoginMutation();
  const { loginUser } = useAuthActions();

  return (
    <FullPageForm title="Set New Password">
      <FormProvider {...formMethods}>
        <form
          tw="space-y-6"
          onSubmit={handleSubmit(async values => {
            try {
              const ret = await login({
                variables: values as any,
              });
              loginUser(ret.data!.login!);
              setState(draft => {
                draft.error = '';
              });
            } catch (e: any) {
              setState(draft => {
                draft.error = e.message;
              });
            }
          })}
        >
          {error && <Alert>{error}</Alert>}
          <ContextInput
            label="Password"
            name="password"
            type="password"
            autoComplete="new-password"
          />
          <ContextInput
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
          />
          <Button type="primary" block htmlType="submit" loading={loading}>
            Change password
          </Button>
        </form>
      </FormProvider>
    </FullPageForm>
  );
}
