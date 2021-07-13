import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { SavableSection } from './SavableSection';
import { ContextInput } from '../../components/ContextInput';
import { UserPhoto } from './UserPhoto';
import Select from '../../components/Select';
import { countryList } from './countryList';

type FormValues = z.infer<typeof schema>;

const schema = z.object({
  username: z.string().nonempty({ message: 'This field is required.' }),
  password: z.string().nonempty({ message: 'This field is required.' }),
});

export function ProfileSection() {
  const formMethods = useForm<FormValues>({
    resolver: zodResolver(schema),
  });
  const countryOptions = React.useMemo(() => {
    return countryList.map(item => ({
      value: item.code,
      label: `${item.emoji} ${item.name}`,
      searchLabel: item.name,
    }));
  }, [countryList]);
  return (
    <SavableSection
      id="profile"
      title="Profile"
      desc="This information will be displayed publicly so be careful what you share."
    >
      <FormProvider {...formMethods}>
        <div tw="space-y-6">
          <div className="mt-6 flex flex-col lg:flex-row">
            <div className="flex-grow space-y-6">
              <ContextInput label="Name" name="name" />
              <div>
                <Select
                  type="white"
                  label="Country"
                  onChange={() => {}}
                  options={countryOptions}
                  value="PL"
                />
              </div>
            </div>
            <UserPhoto />
          </div>
          <ContextInput label="URL" name="url" />
          <ContextInput multiline label="About" name="about" rows={3} />
        </div>
      </FormProvider>
    </SavableSection>
  );
}
