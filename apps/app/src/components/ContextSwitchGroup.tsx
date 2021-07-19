import React from 'react';
import { useContextMethods } from 'src/hooks/useContextMethods';
import { SwitchGroup, SwitchGroupProps } from './SwitchGroup';

interface ContextSwitchGroupProps
  extends Omit<SwitchGroupProps, 'checked' | 'onChange'> {
  name: string;
}

export function ContextSwitchGroup(props: ContextSwitchGroupProps) {
  const { name, ...rest } = props;
  const { value, updateValue } = useContextMethods({
    name,
  });
  return <SwitchGroup {...rest} checked={!!value} onChange={updateValue} />;
}
