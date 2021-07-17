import * as R from 'remeda';
import React, { useState } from 'react';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/dist/client/router';
import { useErrorModalActions } from './ErrorModalModule';
import { SimpleModal } from 'src/components/SimpleModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { gql } from '@apollo/client';
import { useConfirmEmailMutation } from '../generated';
import { useAuthActions } from './AuthModule';

gql`
  mutation ConfirmEmail($code: String!) {
    confirmEmail(code: $code) {
      ...DefaultAuthResult
    }
  }
`;

export function ConfirmEmailChecker() {
  const router = useRouter();
  const errorModalActions = useErrorModalActions();
  const [visibleModal, setVisibleModal] = useState<
    null | 'confirmed' | 'confirmed-new'
  >(null);
  const [confirmEmail] = useConfirmEmailMutation();
  const { loginUser } = useAuthActions();
  React.useEffect(() => {
    const getQuery = (name: string) =>
      Array.isArray(router.query[name]) ? null : (router.query[name] as string);
    const confirmEmailCode = getQuery('confirm-email');
    if (confirmEmailCode) {
      void router.replace({
        pathname: router.pathname,
        query: R.omit(router.query, ['confirm-email']),
      });
      confirmEmail({
        variables: {
          code: confirmEmailCode,
        },
      })
        .then(ret => {
          loginUser(ret.data!.confirmEmail, false);
          setVisibleModal('confirmed');
        })
        .catch(errorModalActions.show);
    }
  }, [router.query]);

  const closeModal = () => {
    setVisibleModal(null);
  };

  return (
    <>
      <SimpleModal
        testId="email-confirmed-modal"
        isOpen={visibleModal === 'confirmed'}
        bgColor="primary"
        title="Confirmed!"
        icon={<FontAwesomeIcon size="4x" icon={faCheckCircle} />}
        header="Confirm account"
        description={<>Your e-mail has been confirmed.</>}
        close={closeModal}
      />
    </>
  );
}
