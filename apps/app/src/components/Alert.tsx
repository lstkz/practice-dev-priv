import { ExclamationIcon } from '@heroicons/react/outline';
import React from 'react';
import 'twin.macro';
import tw from 'twin.macro';
import { VoidLink } from './VoidLink';

interface AlertProps {
  children: React.ReactNode;
  type?: 'error' | 'warning' | 'info';
  onClose?: () => void;
}

export function Alert(props: AlertProps) {
  const { children, type, onClose } = props;
  return (
    <div
      css={[
        tw`rounded-md bg-red-50 p-4 text-red-800 text-center relative`,
        type === 'warning' && tw`bg-yellow-50 text-yellow-700`,
        type === 'info' && tw`bg-blue-100 text-blue-700`,
      ]}
    >
      <div tw="flex justify-center items-center px-10">
        <div tw="flex-shrink-0">
          <ExclamationIcon
            tw="h-5 w-5 text-red-400"
            css={[
              type === 'warning' && tw`text-yellow-400`,
              type === 'info' && tw`text-blue-400`,
            ]}
            aria-hidden="true"
          />
        </div>
        <div tw="ml-3 text-sm">{children}</div>
      </div>
      {onClose && (
        <VoidLink
          tw="w-6 h-6 leading-none font-semibold opacity-75 text-xl border border-dotted border-transparent focus:border-blue-800 hover:opacity-100 cursor-pointer text-blue-800 outline-none hover:no-underline absolute right-5 top-4 flex items-center justify-center"
          data-test="close-btn"
          onClick={onClose}
          aria-label="close"
        >
          ×
        </VoidLink>
      )}
    </div>
  );
}
