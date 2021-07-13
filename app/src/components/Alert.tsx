import { ExclamationIcon } from '@heroicons/react/outline';
import React from 'react';
import 'twin.macro';

interface AlertProps {
  children: React.ReactNode;
}

export function Alert(props: AlertProps) {
  const { children } = props;
  return (
    <div tw="rounded-md bg-red-50 p-4 text-red-800 text-center">
      <div className="flex">
        <div className="flex-shrink-0">
          <ExclamationIcon
            className="h-5 w-5 text-red-400"
            aria-hidden="true"
          />
        </div>
        <div className="ml-3 text-sm">{children}</div>
      </div>
    </div>
  );
}
