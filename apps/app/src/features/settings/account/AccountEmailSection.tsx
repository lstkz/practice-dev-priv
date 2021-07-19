import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { SavableSection } from '../SavableSection';
import { ContextInput } from '../../../components/ContextInput';
import { Input } from '../../../components/Input';
import { gql } from '@apollo/client';
import { Validator } from 'src/common/Validator';
import { useUser } from 'src/features/AuthModule';
import { useErrorModalActions } from 'src/features/ErrorModalModule';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SimpleModal } from 'src/components/SimpleModal';
import { useChangeEmailMutation } from 'src/generated';

interface FormValues {
  email: string;
}

gql`
  mutation ChangeEmail($email: String!) {
    changeEmail(email: $email) {
      ok
    }
  }
`;

export function AccountEmailSection() {
  const user = useUser();
  const formMethods = useForm<FormValues>({
    resolver: data => {
      return new Validator(data).required('email').email('email').validate();
    },
  });
  const [isShowConfirm, setIsShowConfirm] = React.useState(false);
  const { handleSubmit } = formMethods;
  const [changeEmail, { loading }] = useChangeEmailMutation();
  const { show: showError } = useErrorModalActions();

  return (
    <form
      onSubmit={handleSubmit(async values => {
        try {
          const ret = await changeEmail({
            variables: values,
          });
          if (ret.data?.changeEmail.ok) {
            setIsShowConfirm(true);
          }
        } catch (e) {
          showError(e);
        }
      })}
    >
      <SimpleModal
        testId="change-email-modal"
        isOpen={isShowConfirm}
        bgColor="primary"
        title="Confirm email!"
        icon={<FontAwesomeIcon size="4x" icon={faEnvelope} />}
        header="Almost done!"
        description={
          <>
            A confirmation link has been sent to your new email address
            <br />
            Confirm it to change your email.
          </>
        }
        close={() => setIsShowConfirm(false)}
      />
      <SavableSection
        id="email-section"
        title="Email"
        desc="You will have to confirm the new email if you change it."
        isLoading={loading}
      >
        <FormProvider {...formMethods}>
          <div tw="space-y-6 mt-6 ">
            <Input
              disabled
              label="Current email"
              name="email"
              value={user.email}
            />
            <ContextInput label="New email" name="email" />
          </div>
        </FormProvider>
      </SavableSection>
    </form>
  );
}
