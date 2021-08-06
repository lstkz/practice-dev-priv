import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { SavableSection } from '../SavableSection';
import { ContextInput } from '../../../components/ContextInput';
import { UserPhoto } from './UserPhoto';
import { countryList, URL_REGEX } from 'shared';
import { Validator } from 'src/common/Validator';
import { useErrorModalActions } from 'src/features/ErrorModalModule';
import { ContextSelect } from 'src/components/ContextSelect';
import { api } from 'src/services/api';

interface FormValues {
  name?: string | null;
  about?: string | null;
  country?: string | null;
  url?: string | null;
}

interface ProfileSectionProps {
  initialValues: FormValues;
}

export function ProfileSection(props: ProfileSectionProps) {
  const formMethods = useForm<FormValues>({
    defaultValues: props.initialValues,
    resolver: data => {
      return new Validator(data)
        .regex('url', URL_REGEX, 'Invalid url')
        .validate();
    },
  });
  const countryOptions = React.useMemo(() => {
    return countryList.map(item => ({
      value: item.code,
      label: `${item.emoji} ${item.name}`,
      searchLabel: item.name,
    }));
  }, [countryList]);
  const [isLoading, setIsLoading] = React.useState(false);
  const { handleSubmit } = formMethods;
  const { show: showError } = useErrorModalActions();

  return (
    <form
      onSubmit={handleSubmit(async values => {
        try {
          setIsLoading(true);
          await api.user_updateMyProfile(values);
        } catch (e) {
          showError(e);
        } finally {
          setIsLoading(false);
        }
      })}
    >
      <SavableSection
        id="profile"
        title="Profile"
        desc="This information will be displayed publicly so be careful what you share."
        isLoading={isLoading}
      >
        <FormProvider {...formMethods}>
          <div tw="space-y-6 mt-6">
            <div className="flex flex-col lg:flex-row">
              <div className="flex-grow space-y-6">
                <ContextInput label="Name" name="name" />
                <ContextInput multiline label="About" name="about" rows={3} />
              </div>

              <UserPhoto />
            </div>
            <div>
              <ContextSelect
                name="country"
                type="white"
                label="Country"
                options={countryOptions}
              />
            </div>
            <ContextInput label="URL" name="url" />
          </div>
        </FormProvider>
      </SavableSection>
    </form>
  );
}
