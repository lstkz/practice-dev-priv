import { Transition } from '@headlessui/react';
import React, { Fragment } from 'react';

interface DefaultTransitionProps {
  children: React.ReactNode;
  open?: boolean;
}

export function DefaultTransition(props: DefaultTransitionProps) {
  const { children, open } = props;
  return (
    <Transition
      show={open}
      as={Fragment as any}
      enter="transition ease-out duration-100"
      enterFrom="transform opacity-0 scale-95"
      enterTo="transform opacity-100 scale-100"
      leave="transition ease-in duration-75"
      leaveFrom="transform opacity-100 scale-100"
      leaveTo="transform opacity-0 scale-95"
    >
      {children}
    </Transition>
  );
}
