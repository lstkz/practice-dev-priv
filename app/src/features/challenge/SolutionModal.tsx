import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Modal, ModalRef, ModalTitle } from '../../components/Modal';
import { ContextInput } from '../../components/ContextInput';
import { Button } from '../../components/Button';

const schema = z.object({
  title: z.string().nonempty({ message: 'This field is required.' }),
});

type FormValues = z.infer<typeof schema>;

export const SolutionModal = React.forwardRef<ModalRef, {}>((props, ref) => {
  const formMethods = useForm<FormValues>({
    resolver: zodResolver(schema),
  });
  const { handleSubmit } = formMethods;
  const loading = false;
  return (
    <Modal ref={ref} noBgClose>
      <FormProvider {...formMethods}>
        <form
          tw="space-y-6"
          onSubmit={handleSubmit(async values => {
            //
          })}
        >
          <ModalTitle>Add Solution</ModalTitle>
          <ContextInput label="Title" name="title" />
          <Button type="primary" block htmlType="submit" loading={loading}>
            Create
          </Button>
        </form>
      </FormProvider>
    </Modal>
  );
});
