import * as R from 'remeda';
import React, { useState } from 'react';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/dist/client/router';
import { useErrorModalActions } from './ErrorModalModule';
import { SimpleModal } from 'src/components/SimpleModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuthActions } from './AuthModule';
import { api } from 'src/services/api';

export function ConfirmEmailChecker() {
  const router = useRouter();
  const errorModalActions = useErrorModalActions();
  const [visibleModal, setVisibleModal] = useState<
    null | 'confirmed' | 'confirmed-new'
  >(null);
  const { loginUser } = useAuthActions();
  React.useEffect(() => {
    const getQuery = (name: string) =>
      Array.isArray(router.query[name]) ? null : (router.query[name] as string);
    const confirmEmailCode = getQuery('confirm-email');
    const confirmNewEmailCode = getQuery('confirm-new-email');
    if (confirmEmailCode) {
      void router.replace({
        pathname: router.pathname,
        query: R.omit(router.query, ['confirm-email']),
      });
      api
        .user_confirmEmail(confirmEmailCode)
        .then(ret => {
          loginUser(ret, false);
          setVisibleModal('confirmed');
        })
        .catch(errorModalActions.show);
    }
    if (confirmNewEmailCode) {
      void router.replace({
        pathname: router.pathname,
        query: R.omit(router.query, ['confirm-new-email']),
      });
      api
        .user_confirmChangeEmail(confirmNewEmailCode)
        .then(() => {
          setVisibleModal('confirmed-new');
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
        description={<>Your email has been confirmed.</>}
        close={closeModal}
      />
      <SimpleModal
        testId="new-email-confirmed-modal"
        isOpen={visibleModal === 'confirmed-new'}
        bgColor="primary"
        title="Confirmed!"
        icon={<FontAwesomeIcon size="4x" icon={faCheckCircle} />}
        header="Email change"
        description={<>Your new email address has been confirmed.</>}
        close={closeModal}
      />
    </>
  );
}
