import ScrollContainer from 'react-indiana-drag-scroll';
import tw from 'twin.macro';

interface Tab {
  name: string;
  title: string;
  count?: number;
}

interface TabsProps {
  onSelect: (tab: string) => void;
  selected: string;
  tabs: Tab[];
}

export function Tabs(props: TabsProps) {
  const { onSelect, selected, tabs } = props;

  return (
    <ScrollContainer
      vertical={false}
      horizontal
      className="border-b border-gray-200 flex-1"
    >
      <nav className="-mb-px flex" aria-label="Tabs">
        {tabs.map(tab => (
          <a
            onClick={() => {
              if (tab.name !== selected) {
                onSelect(tab.name);
              }
            }}
            tabIndex={0}
            key={tab.name}
            css={[
              tw`border-transparent text-gray-500  whitespace-nowrap flex py-2 px-5 border-b-2 font-medium text-sm flex-grow justify-center`,
              tab.name === selected
                ? tw`border-indigo-500 text-indigo-600`
                : tw`cursor-pointer hover:text-gray-700 hover:border-gray-200`,
            ]}
            aria-current={tab.name === selected ? 'page' : undefined}
          >
            {tab.title}
            {tab.count != null && (
              <span
                css={[
                  tw`ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium md:inline-block bg-gray-100 text-gray-900`,
                  tab.name === selected && tw`bg-indigo-100 text-indigo-600`,
                ]}
              >
                {tab.count}
              </span>
            )}
          </a>
        ))}
      </nav>
    </ScrollContainer>
  );
}
