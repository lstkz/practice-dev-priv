import { Disclosure } from '@headlessui/react';
import { useRouter } from 'next/dist/client/router';
import Link from 'next/link';
import React from 'react';
import { createUrl } from 'src/common/url';
import tw from 'twin.macro';

interface MainMenuProps {
  mobile?: boolean;
}

const navigation = [
  {
    name: 'Modules',
    href: createUrl({ name: 'modules' }),
  },
  {
    name: 'Ranking',
    comingSoon: true,
  },
];

interface MenuItemProps {
  href?: string;
  comingSoon?: boolean;
  children: React.ReactNode;
  current?: boolean;
  block?: boolean;
}

function MenuItem(props: MenuItemProps) {
  const { href, comingSoon, children, current, block } = props;
  const css = [
    current
      ? tw`bg-gray-900 text-white`
      : tw`text-gray-300 hover:bg-gray-700 hover:text-white`,
    !current && !href && tw`cursor-not-allowed`,
    tw`px-3 py-2 rounded-md text-sm font-medium`,
    block && tw`block`,
  ];
  const tag = comingSoon && (
    <div tw="absolute -top-2 -right-9 inline-flex items-center px-1 rounded text-xs font-medium bg-yellow-400 text-gray-800">
      soon
    </div>
  );
  const inner = (
    <span tw="relative">
      {children}
      {tag}
    </span>
  );
  if (!href) {
    return <div css={css}>{inner}</div>;
  }
  return (
    <Link href={href} passHref>
      <a css={css}>{inner}</a>
    </Link>
  );
}

export function MainMenu(props: MainMenuProps) {
  const { mobile } = props;
  const router = useRouter();
  if (mobile) {
    return (
      <Disclosure.Panel tw="sm:hidden">
        <div tw="px-2 pt-2 pb-3 space-y-1">
          {navigation.map((item, i) => (
            <MenuItem
              key={i}
              href={item.href}
              comingSoon={item.comingSoon}
              current={router.pathname === item.href}
              block
            >
              {item.name}
            </MenuItem>
          ))}
        </div>
      </Disclosure.Panel>
    );
  }
  return (
    <div tw="hidden sm:block sm:ml-6">
      <div tw="flex space-x-4">
        {navigation.map((item, i) => (
          <MenuItem
            key={i}
            href={item.href}
            comingSoon={item.comingSoon}
            current={router.pathname === item.href}
          >
            {item.name}
          </MenuItem>
        ))}
      </div>
    </div>
  );
}
