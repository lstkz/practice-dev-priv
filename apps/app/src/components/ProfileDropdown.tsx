import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import tw from 'twin.macro';
import { useAuthActions } from 'src/features/AuthModule';

interface MenuLinkProps {
  active: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

function MenuLink(props: MenuLinkProps) {
  const { active, children, onClick } = props;
  return (
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
}

export function ProfileDropdown() {
  const { logout } = useAuthActions();
  return (
    <Menu as="div" className="ml-3 relative">
      {({ open }) => (
        <>
          <div>
            <Menu.Button className="bg-gray-800 flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
              <span className="sr-only">Open user menu</span>
              <img
                className="h-8 w-8 rounded-full"
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt=""
              />
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
                  <MenuLink active={active}>Your Profile</MenuLink>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => <MenuLink active={active}>Settings</MenuLink>}
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
