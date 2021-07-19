import React from 'react';
import tw from 'twin.macro';
import { useContextMethods } from '../hooks/useContextMethods';
import Select, { SelectProps } from './Select';

interface ContextInputProps extends Omit<SelectProps, 'value' | 'onChange'> {
  name: string;
}

export function ContextSelect(props: ContextInputProps) {
  const { name, ...rest } = props;
  const { value, error, hasError, updateValue } = useContextMethods({
    name,
  });
  return (
    <div className="w-full">
      <Select
        {...rest}
        value={value?.toString() ?? ''}
        onChange={value => {
          updateValue(value);
        }}
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
