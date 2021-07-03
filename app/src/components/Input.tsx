import { ExclamationCircleIcon } from '@heroicons/react/outline';
import * as React from 'react';
import tw from 'twin.macro';

type BaseProps = Pick<
  React.InputHTMLAttributes<HTMLInputElement>,
  | 'value'
  | 'placeholder'
  | 'onChange'
  | 'onBlur'
  | 'type'
  | 'id'
  | 'autoComplete'
  | 'maxLength'
  | 'onKeyPress'
  | 'aria-invalid'
  | 'aria-describedby'
>;

export interface InputProps extends BaseProps {
  name: string;
  className?: string;
  inputClassName?: string;
  size?: 'small' | 'default' | 'large' | 'extra-large';
  feedback?: string;
  state?: 'error';
  label: string;
  noLabel?: boolean;
  testId?: string;
  inputRef?: React.LegacyRef<any>;
}

interface InputFeedbackProps {
  color?: 'primary' | 'warning' | 'danger';
  children?: React.ReactNode;
  className?: string;
  testId?: string;
}
export function InputFeedback(props: InputFeedbackProps) {
  const { color, children, className, testId } = props;

  return (
    <div
      data-test={testId}
      className={className}
      css={[
        tw`text-sm font-light mt-2 text-left`,
        color === 'primary' && tw`text-indigo-600`,
        color === 'warning' && tw`text-yellow-600`,
        color === 'danger' && tw`text-red-600`,
      ]}
    >
      {children}
    </div>
  );
}

export function Input(props: InputProps) {
  const {
    size,
    feedback,
    state,
    className,
    label,
    testId,
    inputRef,
    inputClassName,
    noLabel,
    type = 'text',
    ...rest
  } = props;
  return (
    <div className={className}>
      {label && (
        <label
          css={[
            tw`block text-sm font-medium text-gray-700 mb-1`,
            noLabel && tw`sr-only`,
          ]}
          htmlFor={rest.id}
        >
          {label}
        </label>
      )}
      <div className="relative rounded-md shadow-sm">
        <input
          {...rest}
          ref={inputRef}
          data-test={testId}
          className={inputClassName}
          type={type}
          css={[
            tw`block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md`,
            state === 'error' &&
              tw`border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500`,
          ]}
        />
        {state === 'error' && (
          <div tw="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <ExclamationCircleIcon
              className="h-5 w-5 text-red-500"
              aria-hidden="true"
            />
          </div>
        )}
      </div>
      {feedback && (
        <InputFeedback
          color={state === 'error' ? 'danger' : undefined}
          testId={testId && testId + '-error'}
        >
          {feedback}
        </InputFeedback>
      )}
    </div>
  );
}
