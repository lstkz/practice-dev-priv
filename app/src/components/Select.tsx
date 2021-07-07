import { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid';
import React from 'react';
import tw from 'twin.macro';
import { BaseButtonProps, getBaseButtonStyles } from './Button';

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}

interface Option {
  value: any;
  label: string;
}

interface SelectProps extends BaseButtonProps {
  label: React.ReactNode;
  value: any;
  options: Option[];
  onChange: (value: any) => void;
}

export default function Select(props: SelectProps) {
  const { options, value, label, onChange, ...buttonProps } = props;
  const selected = React.useMemo(() => options.find(x => x.value === value), [
    options,
    value,
  ]);

  return (
    <Listbox value={value} onChange={onChange}>
      {({ open }) => (
        <>
          <Listbox.Label tw="block text-sm font-medium text-gray-700">
            {label}
          </Listbox.Label>
          <div tw="mt-1 relative">
            <Listbox.Button
              css={[
                ...getBaseButtonStyles(buttonProps),
                tw`w-full pl-3 pr-10 py-2 justify-start border-none`,
              ]}
            >
              <span tw="block truncate">{selected?.label ?? '-'}</span>
              <span tw="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <SelectorIcon
                  css={[
                    tw`h-5 w-5 text-gray-400`,
                    buttonProps.type === 'light' && tw`text-black`,
                  ]}
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment as any}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options
                static
                tw="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
              >
                {options.map(option => (
                  <Listbox.Option
                    key={option.value}
                    className={({ active }) =>
                      classNames(
                        active ? 'text-white bg-indigo-600' : 'text-gray-900',
                        'cursor-default select-none relative py-2 pl-3 pr-9'
                      )
                    }
                    value={option.value}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={classNames(
                            selected ? 'font-semibold' : 'font-normal',
                            'block truncate'
                          )}
                        >
                          {option.label}
                        </span>

                        {selected ? (
                          <span
                            className={classNames(
                              active ? 'text-white' : 'text-indigo-600',
                              'absolute inset-y-0 right-0 flex items-center pr-4'
                            )}
                          >
                            <CheckIcon tw="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
}
