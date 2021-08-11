import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Modal, ModalRef, ModalTitle } from '../../components/GenericModal';
import { ContextInput } from '../../components/ContextInput';
import { Button } from '../../components/Button';
import { Validator } from 'src/common/Validator';
import { Alert } from 'src/components/Alert';
import { api } from 'src/services/api';
import { getErrorMessage } from 'src/common/helper';
import { Solution } from 'shared';
import { useImmer } from 'context-api';

interface FormValues {
  title: string;
}

type UpdatedCallback = (solution: Solution) => void;

export interface SolutionModalRef {
  open: (solution: Solution, callback: UpdatedCallback) => void;
}

interface State {
  solution: Solution;
  isLoading: boolean;
  error: string;
  callback: UpdatedCallback;
}

export const SolutionEditModal = React.forwardRef<SolutionModalRef, {}>(
  (_, ref) => {
    const [state, setState] = useImmer<State>({
      solution: null!,
      isLoading: false,
      error: '',
      callback: null!,
    });
    const formMethods = useForm<FormValues>({
      resolver: data => {
        return new Validator(data).required('title').validate();
      },
    });
    const { handleSubmit } = formMethods;
    const modalRef = React.useRef<ModalRef | null>(null);
    React.useImperativeHandle(
      ref,
      () => ({
        open: (solution, callback) => {
          formMethods.reset();
          formMethods.setValue('title', solution.title);
          setState(draft => {
            draft.solution = solution;
            draft.isLoading = false;
            draft.error = '';
            draft.callback = callback;
          });
          modalRef.current?.open();
        },
      }),
      [formMethods]
    );
    const { isLoading, error, solution, callback } = state;
    return (
      <Modal
        ref={value => {
          if (ref) {
            if (typeof ref === 'function') {
              ref(value);
            } else {
              ref.current = value;
            }
          }
          modalRef.current = value;
        }}
        noBgClose
      >
        <FormProvider {...formMethods}>
          <form
            tw="space-y-6"
            onSubmit={handleSubmit(async values => {
              try {
                setState(draft => {
                  draft.isLoading = true;
                });
                const updated = await api.solution_updateSolution(solution.id, {
                  title: values.title,
                });
                callback(updated);
                modalRef.current?.hide();
              } catch (e) {
                setState(draft => {
                  draft.error = getErrorMessage(e);
                });
              } finally {
                setState(draft => {
                  draft.isLoading = false;
                });
              }
            })}
          >
            <ModalTitle>Update Solution</ModalTitle>

            {error && <Alert>{error}</Alert>}
            <ContextInput label="Title" name="title" maxLength={100} />
            <Button type="primary" block htmlType="submit" loading={isLoading}>
              Update
            </Button>
          </form>
        </FormProvider>
      </Modal>
    );
  }
);
