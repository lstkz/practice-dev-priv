import React from 'react';
import { doFn } from 'src/common/helper';
import Select from 'src/components/Select';
import tw from 'twin.macro';
import { useChallengeState } from './ChallengeModule';
import { DetailsTab } from './DetailsTab';
import { SolutionIframe } from './SolutionIframe';
import { TestSuiteTab } from './TestSuiteTab';
import { WebNavigator } from './WebNavigator';

export function MobileTabs() {
  const [tab, setTab] = React.useState('details');
  const { challenge } = useChallengeState();

  return (
    <div tw="bg-gray-900 h-full flex flex-col">
      <div tw="text-white text-center py-1">
        IDE is not supported in mobile view.
      </div>
      <div tw="p-2 flex justify-center">
        <div style={{ width: 250 }}>
          <Select
            type="light"
            focusBg="gray-900"
            value={tab}
            label={<span tw="text-gray-200">View</span>}
            onChange={setTab}
            options={[
              {
                label: 'Details',
                value: 'details',
              },
              {
                label: 'Test Suite',
                value: 'test-suite',
              },
              {
                label: 'Demo',
                value: 'demo',
              },
            ].filter(Boolean)}
          />
        </div>
      </div>
      <div
        tw="p-3 flex-1 flex flex-col"
        css={[tab === 'demo' && tw`px-0 pb-0`]}
      >
        {doFn(() => {
          switch (tab) {
            case 'details':
              return <DetailsTab />;
            case 'test-suite':
              return <TestSuiteTab />;
            case 'demo':
              return (
                <WebNavigator
                  name="DemoNavigator"
                  shallowHidden={false}
                  origin={challenge.solutionUrl}
                >
                  <SolutionIframe />
                </WebNavigator>
              );
            default:
              return null;
          }
        })}
      </div>
    </div>
  );
}
