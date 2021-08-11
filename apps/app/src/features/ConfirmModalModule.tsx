import { createModuleContext, useImmer } from 'context-api';
import React from 'react';
import { ConfirmModal, ConfirmModalProps } from 'src/components/ConfirmModal';

type ConfirmModalPickedProps = Omit<
  ConfirmModalProps,
  'close' | 'confirm' | 'isOpen'
>;

type ConfirmCallback = () => Promise<void> | void;

interface Actions {
  showConfirm: (
    props: ConfirmModalPickedProps,
    onConfirm: ConfirmCallback
  ) => void;
}

interface State {
  modalProps: ConfirmModalPickedProps | null;
  isLoading: boolean;
  isOpen: boolean;
  confirmCallback: ConfirmCallback | null;
}
const [Provider, useContext] = createModuleContext<State, Actions>();

export interface ConfirmModalModuleProps {
  children: React.ReactNode;
}

export function ConfirmModalModule(props: ConfirmModalModuleProps) {
  const { children } = props;
  const [state, setState] = useImmer<State>({
    modalProps: null,
    isLoading: false,
    isOpen: false,
    confirmCallback: null,
  });

  const actions = React.useMemo<Actions>(
    () => ({
      showConfirm: (props, onConfirm) => {
        setState(draft => {
          draft.modalProps = props;
          draft.isLoading = false;
          draft.isOpen = true;
          draft.confirmCallback = onConfirm;
        });
      },
    }),
    []
  );

  const { confirmCallback, isLoading, isOpen, modalProps } = state;

  return (
    <Provider state={state} actions={actions}>
      {modalProps && (
        <ConfirmModal
          testId="confirm-modal"
          {...modalProps}
          isOpen={isOpen}
          confirm={async () => {
            setState(draft => {
              draft.isLoading = true;
            });
            try {
              await confirmCallback!();
              setState(draft => {
                draft.isOpen = false;
              });
            } finally {
              setState(draft => {
                draft.isLoading = false;
              });
            }
          }}
          isLoading={isLoading}
          close={() => {
            setState(draft => {
              draft.isOpen = false;
            });
          }}
        />
      )}
      {children}
    </Provider>
  );
}

export function useConfirmModalActions() {
  return useContext().actions;
}
