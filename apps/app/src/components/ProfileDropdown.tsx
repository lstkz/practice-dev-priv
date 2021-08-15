import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import tw from 'twin.macro';
import { useAuthActions, useUser } from 'src/features/AuthModule';
import Link from 'next/link';
import { createUrl } from 'src/common/url';
import { UserAvatar } from './UserAvatar';

interface MenuLinkProps {
  href?: string;
  active: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

function MenuLink(props: MenuLinkProps) {
  const { active, children, onClick, href } = props;
  const inner = (
    <a
      tabIndex={0}
      onClick={onClick}
      css={[
        tw`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer`,
        active && tw`bg-gray-100 hover:bg-gray-100`,
      ]}
    >
      {children}
    </a>
  );
  if (href) {
    return (
      <Link href={href} passHref>
        {inner}
      </Link>
    );
  }
  return inner;
}

export function ProfileDropdown() {
  const { logout } = useAuthActions();
  const user = useUser();
  return (
    <Menu as="div" className="ml-3 relative">
      {({ open }) => (
        <>
          <div>
            <Menu.Button className="bg-gray-800 flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
              <span className="sr-only">Open user menu</span>
              <UserAvatar user={user} />
            </Menu.Button>
          </div>
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
              className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
            >
              <Menu.Item>
                {({ active }) => (
                  <MenuLink
                    href={createUrl({
                      name: 'profile',
                      username: user.username,
                    })}
                    active={active}
                  >
                    Your Profile
                  </MenuLink>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <MenuLink
                    active={active}
                    href={createUrl({ name: 'settings' })}
                  >
                    Settings
                  </MenuLink>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <MenuLink onClick={logout} active={active}>
                    Sign out
                  </MenuLink>
                )}
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
}
