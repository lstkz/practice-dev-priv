import React from 'react';
import { Disclosure } from '@headlessui/react';
import { MenuIcon, XIcon } from '@heroicons/react/outline';
import tw from 'twin.macro';
import { ProfileDropdown } from './ProfileDropdown';
import Link from 'next/link';
import { createUrl } from '../common/url';
import { Button } from './Button';
import Footer from '../features/landing/Footer';
import logo from '../../public/logo.png';
import { useUser } from 'src/features/AuthModule';

const navigation = [
  { name: 'Dashboard', href: '#', current: true },
  { name: 'Team', href: '#', current: false },
  { name: 'Projects', href: '#', current: false },
  { name: 'Calendar', href: '#', current: false },
];

interface DashboardProps {
  children: React.ReactNode;
}

export default function Dashboard(props: DashboardProps) {
  const { children } = props;
  const user = useUser();
  return (
    <>
      <Disclosure as="nav" className="bg-gray-800">
        {({ open }) => (
          <>
            <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
              <div className="relative flex items-center justify-between h-16">
                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                  {/* Mobile menu button*/}
                  <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
                <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                  <div className="flex-shrink-0 flex items-center">
                    <Link href={createUrl({ name: 'modules' })}>
                      <a>
                        <span className="sr-only">Practice.dev</span>
                        <img
                          className="h-6 w-auto"
                          src={logo.src}
                          alt="practice.dev"
                        />
                      </a>
                    </Link>
                  </div>
                  <div className="hidden sm:block sm:ml-6">
                    <div className="flex space-x-4">
                      {navigation.map(item => (
                        <a
                          key={item.name}
                          href={item.href}
                          css={[
                            item.current
                              ? tw`bg-gray-900 text-white`
                              : tw`text-gray-300 hover:bg-gray-700 hover:text-white`,
                            tw`px-3 py-2 rounded-md text-sm font-medium`,
                          ]}
                          aria-current={item.current ? 'page' : undefined}
                        >
                          {item.name}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                  {user ? (
                    <ProfileDropdown />
                  ) : (
                    <div tw="space-x-4">
                      <Button
                        href={createUrl({ name: 'login' })}
                        focusBg="gray-800"
                        type="white"
                      >
                        Log in
                      </Button>
                      <Button
                        href={createUrl({ name: 'register' })}
                        focusBg="gray-800"
                        type="primary"
                      >
                        Join now
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Disclosure.Panel className="sm:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navigation.map(item => (
                  <a
                    key={item.name}
                    href={item.href}
                    css={[
                      item.current
                        ? tw`bg-gray-900 text-white`
                        : tw`text-gray-300 hover:bg-gray-700 hover:text-white`,
                      tw`block px-3 py-2 rounded-md text-base font-medium`,
                    ]}
                    aria-current={item.current ? 'page' : undefined}
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
      <div tw="bg-gray-50 flex-1">{children}</div>
      <Footer />
    </>
  );
}
