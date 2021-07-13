import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { SavableSection } from './SavableSection';
import { ContextInput } from '../../components/ContextInput';

type FormValues = z.infer<typeof schema>;

const schema = z.object({
  username: z.string().nonempty({ message: 'This field is required.' }),
  password: z.string().nonempty({ message: 'This field is required.' }),
});

export function PasswordSection() {
  const formMethods = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  return (
    <SavableSection id="password-section" title="Password">
      <FormProvider {...formMethods}>
        <div tw="space-y-6 mt-6 ">
          <ContextInput label="New password" name="password" type="password" />
          <ContextInput
            label="Confirm new password"
            name="confirmPassword"
            type="password"
          />
        </div>
      </FormProvider>
    </SavableSection>
  );
}
