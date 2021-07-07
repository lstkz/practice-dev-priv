import {
  faCopy,
  faInfoCircle,
  faTasks,
  faLightbulb,
  faHistory,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import tw from 'twin.macro';

const sidebarNavigation = [
  { name: 'Details', href: '#', fa: faInfoCircle, current: true },
  { name: 'File Explorer', href: '#', fa: faCopy, current: false },
  { name: 'Test Suite', href: '#', fa: faTasks, current: false },
  { name: 'Solutions', href: '#', fa: faLightbulb, current: false },
  { name: 'Submission History', href: '#', fa: faHistory, current: false },
];

export function ChallengeSidebar() {
  return (
    <nav aria-label="Sidebar" tw="flex-shrink-0 bg-gray-800 overflow-y-auto">
      <div tw="relative flex flex-col p-2 space-y-3">
        {sidebarNavigation.map(item => (
          <button
            key={item.name}
            css={[
              item.current
                ? tw`bg-gray-900 text-white`
                : tw`text-gray-400 hover:bg-gray-700`,
              tw`flex-shrink-0 inline-flex items-center justify-center h-10 w-10 rounded-lg`,
              tw`focus:( outline-none ring-1 ring-gray-700)`,
            ]}
          >
            <span tw="sr-only">{item.name}</span>
            {item.fa && (
              <FontAwesomeIcon
                className="h-6 w-6"
                aria-hidden="true"
                icon={item.fa}
              />
            )}
          </button>
        ))}
      </div>
    </nav>
  );
}
