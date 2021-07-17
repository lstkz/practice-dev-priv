import { ExclamationIcon } from '@heroicons/react/outline';
import React from 'react';
import 'twin.macro';
import tw from 'twin.macro';

interface AlertProps {
  children: React.ReactNode;
  type?: 'error' | 'warning';
}

export function Alert(props: AlertProps) {
  const { children, type } = props;
  return (
    <div
      css={[
        tw`rounded-md bg-red-50 p-4 text-red-800 text-center`,
        type === 'warning' && tw`bg-yellow-50 text-yellow-700`,
      ]}
    >
      <div tw="flex justify-center items-center">
        <div tw="flex-shrink-0">
          <ExclamationIcon
            tw="h-5 w-5 text-red-400"
            css={[type === 'warning' && tw`text-yellow-400`]}
            aria-hidden="true"
          />
        </div>
        <div tw="ml-3 text-sm">{children}</div>
      </div>
    </div>
  );
}
