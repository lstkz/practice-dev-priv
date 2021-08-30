import React from 'react';
import { Disclosure } from '@headlessui/react';
import { MenuIcon, XIcon } from '@heroicons/react/outline';
import { ProfileDropdown } from './ProfileDropdown';
import Link from 'next/link';
import { createUrl } from '../common/url';
import Footer from '../features/landing/Footer';
import logo from '../../public/logo.png';
import { useUser } from 'src/features/AuthModule';
import { VerifyAccountAlert } from './VerifyAccountAlert';
import { HeaderAuthButtons, MainMenu } from './MainMenu';
import { CustomImage } from './CustomImage';
import { SubscribeNewsletterAlert } from './SubscribeNewsletterAlert';
import { Logo } from './Logo';
import tw from 'twin.macro';

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
                    <Logo
                      imgCss={tw`h-6 w-auto`}
                      href={createUrl({ name: 'modules' })}
                    />
                  </div>
                  <MainMenu />
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                  {user ? (
                    <ProfileDropdown />
                  ) : (
                    <div tw="space-x-4 hidden sm:block">
                      <HeaderAuthButtons />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <MainMenu mobile />
          </>
        )}
      </Disclosure>
      <div tw="bg-gray-50 flex-1 pb-10">
        {user && !user.isVerified && <VerifyAccountAlert />}
        {user && <SubscribeNewsletterAlert />}
        {children}
      </div>
      <Footer />
    </>
  );
}
