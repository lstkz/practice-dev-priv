import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { SavableSection } from './SavableSection';
import { SwitchGroup } from '../../components/SwitchGroup';

type FormValues = z.infer<typeof schema>;

const schema = z.object({
  username: z.string().nonempty({ message: 'This field is required.' }),
  password: z.string().nonempty({ message: 'This field is required.' }),
});

export function NotificationsSection() {
  const formMethods = useForm<FormValues>({
    resolver: zodResolver(schema),
  });
  const [newsletter, setNewsletter] = React.useState(false);

  return (
    <SavableSection id="notifications-section" title="Email Notifications">
      <FormProvider {...formMethods}>
        <div tw="space-y-6 mt-6 ">
          <SwitchGroup
            label="Newsletter"
            description="News about new functionality and new features. Zero spam!"
            checked={newsletter}
            onChange={setNewsletter}
          />
        </div>
      </FormProvider>
    </SavableSection>
  );
}
