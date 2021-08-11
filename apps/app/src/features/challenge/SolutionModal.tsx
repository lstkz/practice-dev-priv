import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Modal, ModalRef, ModalTitle } from '../../components/GenericModal';
import { ContextInput } from '../../components/ContextInput';
import { Button } from '../../components/Button';
import { Validator } from 'src/common/Validator';
import { Alert } from 'src/components/Alert';
import { api } from 'src/services/api';
import { getErrorMessage } from 'src/common/helper';
import { CheckIcon } from '@heroicons/react/outline';

interface FormValues {
  title: string;
}

interface SolutionModalProps {
  submissionId: string;
  markAsShared: () => void;
}

export const SolutionModal = React.forwardRef<ModalRef, SolutionModalProps>(
  (props, ref) => {
    const { submissionId, markAsShared } = props;
    const formMethods = useForm<FormValues>({
      resolver: data => {
        return new Validator(data).required('title').validate();
      },
    });
    const { handleSubmit } = formMethods;
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState('');
    const [isSuccess, setIsSuccess] = React.useState(true);
    const modalRef = React.useRef<ModalRef | null>(null);
    React.useEffect(() => {
      setIsLoading(false);
      setError('');
      setIsSuccess(false);
      formMethods.reset();
    }, [submissionId]);
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
                setIsLoading(true);
                await api.solution_createSolution({
                  title: values.title,
                  submissionId,
                });
                markAsShared();
                setIsSuccess(true);
              } catch (e) {
                setError(getErrorMessage(e));
              } finally {
                setIsLoading(false);
              }
            })}
          >
            <ModalTitle>Add Solution</ModalTitle>
            {isSuccess ? (
              <>
                <div>
                  <div tw="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
                    <CheckIcon tw="h-8 w-8 text-green-600" aria-hidden="true" />
                  </div>
                  <div tw="text-center m-3 text-gray-600">
                    Your solution has been created successfully.
                  </div>
                  <Button
                    type="primary"
                    htmlType="button"
                    block
                    onClick={() => {
                      modalRef.current?.hide();
                    }}
                  >
                    Close
                  </Button>
                </div>
              </>
            ) : (
              <>
                {error && <Alert>{error}</Alert>}
                <ContextInput label="Title" name="title" maxLength={100} />
                <Button
                  type="primary"
                  block
                  htmlType="submit"
                  loading={isLoading}
                >
                  Create
                </Button>
              </>
            )}
          </form>
        </FormProvider>
      </Modal>
    );
  }
);
