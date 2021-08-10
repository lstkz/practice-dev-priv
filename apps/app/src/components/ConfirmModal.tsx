import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Button } from './Button';
import { Modal } from './Modal';

interface ConfirmModalProps {
  testId?: string;
  children: React.ReactNode;
  title: React.ReactNode;
  isOpen: boolean;
  close: () => void;
  confirm: () => void;
  yesContent?: React.ReactNode;
  noContent?: React.ReactNode;
}

export function ConfirmModal(props: ConfirmModalProps) {
  const { children, title, confirm, yesContent, noContent, ...rest } = props;

  return (
    <Modal
      {...rest}
      bgColor="primary"
      footer={
        <div tw="grid grid-cols-2 gap-4 w-1/2 m-auto">
          <Button
            testId="no-btn"
            type="white"
            onClick={props.close}
            focusBg="indigo-600"
          >
            {noContent || 'No'}
          </Button>
          <Button
            testId="yes-btn"
            type="white"
            focusBg="indigo-600"
            onClick={confirm}
          >
            {yesContent || 'Yes'}
          </Button>
        </div>
      }
    >
      <div tw="text-center py-6">
        <FontAwesomeIcon size="4x" icon={faQuestionCircle} />
        <h3 tw="text-2xl text-center mt-4 mb-3 text-white">{title}</h3>
        <div>{children}</div>
      </div>
    </Modal>
  );
}
