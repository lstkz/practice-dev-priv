import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { SavableSection } from './SavableSection';
import { ContextInput } from '../../components/ContextInput';
import { Input } from '../../components/Input';

type FormValues = z.infer<typeof schema>;

const schema = z.object({
  username: z.string().nonempty({ message: 'This field is required.' }),
  password: z.string().nonempty({ message: 'This field is required.' }),
});

export function AccountEmailSection() {
  const formMethods = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  return (
    <SavableSection
      id="email-section"
      title="Email"
      desc="You will have to confirm the new email if you change it."
    >
      <FormProvider {...formMethods}>
        <div tw="space-y-6 mt-6 ">
          <Input
            disabled
            label="Current email"
            name="email"
            value="user1@example.org"
          />
          <ContextInput label="New email" name="email" />
        </div>
      </FormProvider>
    </SavableSection>
  );
}
