import React from 'react';
import { Menu } from '@headlessui/react';
import { DotsVerticalIcon } from '@heroicons/react/solid';
import { DefaultTransition } from 'src/components/DefaultTransition';
import tw from 'twin.macro';
import { ConfirmModal } from 'src/components/ConfirmModal';
import { useChallengeActions } from './ChallengeModule';

export function ChallengeMenu() {
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const { resetWorkspace } = useChallengeActions();
  return (
    <>
      <ConfirmModal
        title="Are you sure to reset?"
        children="Your all existing files will be reverted."
        yesContent="Reset"
        noContent="Cancel"
        close={() => {
          setIsConfirmOpen(false);
        }}
        confirm={async () => {
          try {
            setIsLoading(true);
            await resetWorkspace();
          } finally {
            setIsLoading(false);
            setIsConfirmOpen(false);
          }
        }}
        isLoading={isLoading}
        isOpen={isConfirmOpen}
      />
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className=" flex items-center text-white hover:text-gray-300 focus:outline-none focus:ring-2  focus:ring-indigo-500">
            <span className="sr-only">Open options</span>
            <DotsVerticalIcon className="h-5 w-5" aria-hidden="true" />
          </Menu.Button>
        </div>

        <DefaultTransition>
          <Menu.Items className="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <a
                    tabIndex={0}
                    css={[
                      tw`block px-4 py-2 text-sm cursor-pointer`,
                      active
                        ? tw`bg-gray-100 text-gray-900`
                        : tw`text-gray-700`,
                    ]}
                    onClick={() => {
                      setIsConfirmOpen(true);
                    }}
                  >
                    Reset source code
                  </a>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </DefaultTransition>
      </Menu>
    </>
  );
}
