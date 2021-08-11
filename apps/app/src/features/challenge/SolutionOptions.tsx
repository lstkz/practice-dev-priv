import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/solid';
import { Button, getBaseButtonStyles } from '../../components/Button';
import tw from 'twin.macro';

interface MenuItemProps {
  children: React.ReactNode;
  className?: any;
  onClick: () => void;
}
function MenuItem(props: MenuItemProps) {
  const { children, className, onClick } = props;
  return (
    <Menu.Item onClick={onClick}>
      {({ active }) => (
        <div
          css={[
            active ? tw`bg-gray-100 text-gray-900` : tw`text-gray-700`,
            tw`block px-4 py-2 text-sm cursor-pointer`,
          ]}
          className={className}
        >
          {children}
        </div>
      )}
    </Menu.Item>
  );
}

type SolutionMenuAction = 'copy-link' | 'edit' | 'delete' | 'report';

interface SolutionOptionsProps {
  onAction: (action: SolutionMenuAction) => void;
}

export function SolutionOptions(props: SolutionOptionsProps) {
  const { onAction } = props;
  const focusFixCss = tw`relative focus:ring-0 focus:outline-none focus:ring-offset-0`;
  const [isFocused1, setIsFocused1] = React.useState(false);
  const [isFocused2, setIsFocused2] = React.useState(false);
  return (
    <span
      css={[
        tw`relative inline-flex shadow-sm rounded-md`,
        (isFocused1 || isFocused2) &&
          tw`
      outline-none ring-2 ring-offset-2  ring-indigo-500 
      ring-offset-gray-800
      `,
      ]}
    >
      <Button
        css={[focusFixCss, tw`rounded-r-none `]}
        type="light"
        size="small"
        focusBg="gray-900"
        onFocus={() => {
          setIsFocused1(true);
        }}
        onBlur={() => {
          setIsFocused1(false);
        }}
      >
        Load
      </Button>
      <Menu as="span" className="-ml-px relative block">
        {({ open }) => (
          <>
            <Menu.Button
              css={[
                ...getBaseButtonStyles({ type: 'light', focusBg: 'gray-900' }),
                focusFixCss,
                tw`rounded-l-none px-1 py-2 border-0  border-l border-indigo-600 `,
              ]}
              onFocus={() => {
                setIsFocused2(true);
              }}
              onBlur={() => {
                setIsFocused2(false);
              }}
            >
              <span tw="sr-only">Open options</span>
              <ChevronDownIcon tw="h-5 w-5" aria-hidden="true" />
            </Menu.Button>
            <Transition
              show={open}
              as={Fragment as any}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items
                static
                tw="origin-top-right absolute right-0 mt-2 -mr-1 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-40"
              >
                <div tw="py-1">
                  <MenuItem onClick={() => onAction('copy-link')}>
                    Copy Link
                  </MenuItem>
                  <MenuItem onClick={() => onAction('edit')}>Edit</MenuItem>
                  <MenuItem onClick={() => onAction('delete')}>Remove</MenuItem>
                  <MenuItem
                    onClick={() => onAction('report')}
                    tw="text-red-500!"
                  >
                    Report
                  </MenuItem>
                </div>
              </Menu.Items>
            </Transition>
          </>
        )}
      </Menu>
    </span>
  );
}
