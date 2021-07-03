import * as React from 'react';
import tw from 'twin.macro';

type BaseProps = Pick<
  React.InputHTMLAttributes<HTMLInputElement>,
  | 'value'
  | 'placeholder'
  | 'onChange'
  | 'type'
  | 'id'
  | 'autoComplete'
  | 'maxLength'
  | 'onKeyPress'
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
            tw`text-gray-600 text-sm mb-2 font-medium`,
            noLabel && tw`sr-only`,
          ]}
          htmlFor={rest.id}
        >
          {label}
        </label>
      )}
      <input
        {...rest}
        ref={inputRef}
        data-test={testId}
        className={inputClassName}
        type={type}
        css={[
          tw`block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md`,
          // tw`block w-full text-gray-700 border border-gray-300 shadow-sm transition-all placeholder-gray-500`,
          // tw`outline-none`,
          // tw`focus:border-primary focus:shadow-lg focus:placeholder-gray-400`,
          // size === 'large' && tw`px-7 py-4 rounded-lg`,
          // size === 'small' && tw`px-3 py-4 rounded-md`,
          // !size && tw`py-3 px-5 rounded-md`,
          state === 'error' && tw`border-red-500 focus:border-red-700`,
        ]}
      />
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
