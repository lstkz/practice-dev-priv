import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { SavableSection } from '../SavableSection';
import { ContextInput } from '../../../components/ContextInput';

type FormValues = z.infer<typeof schema>;

const schema = z.object({
  username: z.string().nonempty({ message: 'This field is required.' }),
  password: z.string().nonempty({ message: 'This field is required.' }),
});

export function AccountUsernameSection() {
  const formMethods = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  return (
    <SavableSection
      id="username-section"
      title="Username"
      desc="Be careful when changing the username, someone can take your old username."
    >
      <FormProvider {...formMethods}>
        <div tw="space-y-6 mt-6 ">
          <ContextInput label="Username" name="username" />
        </div>
      </FormProvider>
    </SavableSection>
  );
}
