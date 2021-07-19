import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { SavableSection } from '../SavableSection';
import { ContextInput } from '../../../components/ContextInput';
import { UserPhoto } from '../UserPhoto';
import Select from '../../../components/Select';
import { countryList, URL_REGEX } from 'shared';
import { Validator } from 'src/common/Validator';
import { gql } from '@apollo/client';
import { useUpdateMyProfileMutation } from 'src/generated';
import { useErrorModalActions } from 'src/features/ErrorModalModule';

interface FormValues {
  name?: string | null;
  about?: string | null;
  country?: string | null;
  url?: string | null;
}

interface ProfileSectionProps {
  initialValues: FormValues;
}

gql`
  mutation UpdateMyProfile($values: UpdateProfileInput!) {
    updateMyProfile(values: $values) {
      name
      about
      country
      url
    }
  }
`;

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
  const { handleSubmit } = formMethods;
  const [updateMyProfile, { loading }] = useUpdateMyProfileMutation();
  const { show: showError } = useErrorModalActions();

  return (
    <form
      onSubmit={handleSubmit(async values => {
        try {
          await updateMyProfile({
            variables: {
              values,
            },
          });
        } catch (e) {
          showError(e);
        }
      })}
    >
      <SavableSection
        id="profile"
        title="Profile"
        desc="This information will be displayed publicly so be careful what you share."
        isLoading={loading}
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
              <Select
                type="white"
                label="Country"
                onChange={() => {}}
                options={countryOptions}
                value="PL"
              />
            </div>
            <ContextInput label="URL" name="url" />
          </div>
        </FormProvider>
      </SavableSection>
    </form>
  );
}
