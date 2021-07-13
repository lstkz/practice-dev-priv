import React from 'react';
import { Switch } from '@headlessui/react';
import tw from 'twin.macro';

interface SwitchGroupProps {
  label: React.ReactNode;
  description?: React.ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function SwitchGroup(props: SwitchGroupProps) {
  const { label, description, checked, onChange } = props;
  return (
    <Switch.Group as="li" className="py-4 flex items-center justify-between">
      <div className="flex flex-col">
        <Switch.Label
          as="p"
          className="text-sm font-medium text-gray-900"
          passive
        >
          {label}
        </Switch.Label>
        <Switch.Description className="text-sm text-gray-500">
          {description}
        </Switch.Description>
      </div>
      <Switch
        checked={checked}
        onChange={onChange}
        css={[
          tw`ml-4 relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`,
          checked ? tw`bg-indigo-500` : tw`bg-gray-200`,
        ]}
      >
        <span
          aria-hidden="true"
          css={[
            tw`inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`,
            checked ? tw`translate-x-5` : tw`translate-x-0`,
          ]}
        />
      </Switch>
    </Switch.Group>
  );
}
