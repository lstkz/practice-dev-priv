import * as React from 'react';
import { Logo } from './Logo';

interface AuthFormProps {
  title: string;
  children: React.ReactNode;
  bottom?: React.ReactNode;
  testId?: string;
}

export function FullPageForm(props: AuthFormProps) {
  const { title, children, bottom, testId } = props;

  return (
    <div
      data-test={testId}
      tw="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8"
    >
      <div tw="sm:mx-auto sm:w-full sm:max-w-md">
        <Logo black tw="mx-auto" />
        <h2 tw="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {title}
        </h2>
      </div>
      <div tw="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div tw="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {children}
        </div>
        {bottom && (
          <div tw="text-sm text-center mt-3 text-gray-700">{bottom}</div>
        )}
      </div>
    </div>
  );
}
