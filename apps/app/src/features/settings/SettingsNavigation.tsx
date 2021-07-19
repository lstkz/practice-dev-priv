import {
  BellIcon,
  CogIcon,
  KeyIcon,
  UserCircleIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/outline';
import { useRouter } from 'next/dist/client/router';
import Link from 'next/link';
import React from 'react';
import { createUrl } from 'src/common/url';
import tw from 'twin.macro';
import { SettingsTab } from './SettingsModule';

const subNavigation = [
  {
    name: 'profile' as SettingsTab,
    label: 'Profile',
    href: createUrl({ name: 'settings' }),
    icon: UserCircleIcon,
  },
  {
    name: 'account' as SettingsTab,
    label: 'Account',
    href: createUrl({ name: 'settings', sub: 'account' }),
    icon: CogIcon,
  },
  {
    name: 'password' as SettingsTab,
    label: 'Password',
    href: createUrl({ name: 'settings', sub: 'password' }),
    icon: KeyIcon,
  },
  {
    name: 'notifications' as SettingsTab,
    label: 'Notifications',
    href: createUrl({ name: 'settings', sub: 'notifications' }),
    icon: BellIcon,
  },
  {
    name: 'crypto' as SettingsTab,
    label: 'Crypto',
    href: createUrl({ name: 'settings', sub: 'crypto' }),
    icon: CurrencyDollarIcon,
  },
];

export function SettingsNavigation() {
  const router = useRouter();
  const parts = router.route.split('/').slice(1);
  const tab = parts.length === 1 ? 'profile' : parts[1];
  return (
    <aside tw="py-6 px-2 sm:px-6 lg:py-0 lg:px-0 lg:col-span-3">
      <nav tw="space-y-1">
        {subNavigation.map(item => {
          const Icon = item.icon;
          return (
            <Link key={item.name} href={item.href} passHref>
              <a
                href={item.href}
                className="group"
                css={[
                  item.name === tab
                    ? tw`bg-gray-100 text-yellow-600 hover:bg-white`
                    : tw`text-gray-900 hover:text-gray-900 hover:bg-gray-100`,
                  tw` rounded-md px-3 py-2 flex items-center text-sm font-medium`,
                ]}
                aria-current={item.name === tab ? 'page' : undefined}
              >
                <div
                  css={[
                    item.name === tab
                      ? tw`text-yellow-500!`
                      : tw`text-gray-400 group-hover:text-gray-500`,
                    tw`flex-shrink-0 -ml-1 mr-3 h-6 w-6`,
                  ]}
                >
                  <Icon aria-hidden="true" />
                </div>
                <span tw="truncate">{item.label}</span>
              </a>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
