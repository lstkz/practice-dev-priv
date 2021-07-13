import {
  BellIcon,
  CogIcon,
  KeyIcon,
  UserCircleIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/outline';
import tw from 'twin.macro';
import {
  SettingsTab,
  useSettingsActions,
  useSettingsState,
} from './SettingsModule';

const subNavigation = [
  {
    name: 'profile' as SettingsTab,
    label: 'Profile',
    href: '#',
    icon: UserCircleIcon,
  },
  {
    name: 'account' as SettingsTab,
    label: 'Account',
    href: '#',
    icon: CogIcon,
  },
  {
    name: 'password' as SettingsTab,
    label: 'Password',
    href: '#',
    icon: KeyIcon,
  },
  {
    name: 'notifications' as SettingsTab,
    label: 'Notifications',
    href: '#',
    icon: BellIcon,
  },
  {
    name: 'crypto' as SettingsTab,
    label: 'Crypto',
    href: '#',
    icon: CurrencyDollarIcon,
  },
];

export function SettingsNavigation() {
  const { updateTab } = useSettingsActions();
  const { tab } = useSettingsState();
  return (
    <aside tw="py-6 px-2 sm:px-6 lg:py-0 lg:px-0 lg:col-span-3">
      <nav tw="space-y-1">
        {subNavigation.map(item => {
          const Icon = item.icon;
          return (
            <a
              onClick={() => updateTab(item.name)}
              key={item.name}
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
          );
        })}
      </nav>
    </aside>
  );
}
