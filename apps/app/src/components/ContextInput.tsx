import React from 'react';
import tw from 'twin.macro';
import { useContextMethods } from '../hooks/useContextMethods';
import { Input, InputProps } from './Input';

interface ContextInputProps extends InputProps {
  name: string;
  limitMax?: boolean;
}

export function ContextInput(props: ContextInputProps) {
  const { name, limitMax, maxLength, ...rest } = props;
  const { value, error, hasError, updateValue, blur } = useContextMethods({
    name,
  });
  return (
    <div className="w-full">
      <Input
        {...rest}
        maxLength={limitMax ? 100 : maxLength}
        name={name}
        value={value?.toString() ?? ''}
        onBlur={blur}
        onChange={e => {
          updateValue(e.target.value);
        }}
        state={hasError ? 'error' : undefined}
        aria-invalid={hasError}
        aria-describedby={`${name}-error`}
      />
      {hasError && (
        <div id={`${name}-error`} css={tw`mt-2 text-sm text-red-600`}>
          {error}
        </div>
      )}
    </div>
  );
}
