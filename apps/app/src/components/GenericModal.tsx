import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

export interface ModalProps {
  children: React.ReactNode;
  noBgClose?: boolean;
  testId?: string;
}

export interface ModalRef {
  open: () => void;
  hide: () => void;
}

interface ModalTitleProps {
  children: React.ReactNode;
}
export function ModalTitle(props: ModalTitleProps) {
  const { children } = props;
  return (
    <Dialog.Title
      as="h3"
      className="text-lg leading-6 font-medium text-gray-900 text-center"
    >
      {children}
    </Dialog.Title>
  );
}

export const Modal = React.forwardRef<ModalRef, ModalProps>((props, ref) => {
  const { children, noBgClose } = props;
  const [open, setOpen] = React.useState(false);
  React.useImperativeHandle(ref, () => {
    return {
      open: () => {
        setOpen(true);
      },
      hide: () => {
        setOpen(false);
      },
    };
  });
  return (
    <Transition.Root show={open} as={React.Fragment as any}>
      <Dialog
        as="div"
        static
        className="fixed z-10 inset-0 overflow-y-auto"
        open={open}
        onClose={() => {
          if (!noBgClose) {
            setOpen(false);
          }
        }}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={React.Fragment as any}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={React.Fragment as any}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-3 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6 relative">
              <button
                onClick={() => setOpen(false)}
                tw="absolute right-2 top-2 focus:outline-none w-4 h-4 flex items-center justify-center hover:text-gray-600 focus-visible:text-gray-600 focus-visible:outline-black"
              >
                <span tw="sr-only">Close</span>
                <FontAwesomeIcon icon={faTimes} />
              </button>
              {children}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
});
