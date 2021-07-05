import ScrollContainer from 'react-indiana-drag-scroll';

const tabs = [
  { name: 'Details', href: '#', current: true },
  { name: 'Solutions', href: '#', count: '6', current: false },
  { name: 'Test Suite', href: '#', current: false },
  { name: 'Submissions', href: '#', current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function ChallengeTabs() {
  return (
    <ScrollContainer
      vertical={false}
      horizontal
      className="border-b border-gray-200 flex-1"
    >
      <nav className="-mb-px flex" aria-label="Tabs">
        {tabs.map(tab => (
          <a
            tabIndex={0}
            key={tab.name}
            className={classNames(
              tab.current
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200',
              'whitespace-nowrap flex py-3 px-5 border-b-2 font-medium text-sm flex-grow justify-center'
            )}
            aria-current={tab.current ? 'page' : undefined}
          >
            {tab.name}
            {tab.count ? (
              <span
                className={classNames(
                  tab.current
                    ? 'bg-indigo-100 text-indigo-600'
                    : 'bg-gray-100 text-gray-900',
                  'hidden ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium md:inline-block'
                )}
              >
                {tab.count}
              </span>
            ) : null}
          </a>
        ))}
      </nav>
    </ScrollContainer>
  );
}
