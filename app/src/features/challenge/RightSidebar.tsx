import React from 'react';
import { ChallengeSidebar } from './ChallengeSidebar';
import {
  faGlobe,
  faCheckCircle,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';
import { useChallengeActions, useChallengeState } from './ChallengeModule';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export function RightSidebar() {
  const { setRightSidebarTab } = useChallengeActions();
  const { rightSidebarTab } = useChallengeState();
  return (
    <ChallengeSidebar
      tooltipPlace="left"
      onSelect={name => {
        if (rightSidebarTab === name) {
          setRightSidebarTab(null);
        } else {
          setRightSidebarTab(name);
        }
      }}
      items={[
        {
          name: 'preview',
          label: 'Preview',
          fa: faGlobe,
          current: rightSidebarTab === 'preview',
        },
        {
          name: 'demo',
          label: 'Demo',
          current: rightSidebarTab === 'demo',
          customIcon: (
            <div tw="relative">
              <FontAwesomeIcon tw="h-6 w-6" aria-hidden="true" icon={faGlobe} />
              <div tw="h-4 w-4 absolute -right-2 bottom-0 rounded-full bg-gray-800 flex items-center justify-center group-hover:bg-gray-700">
                <FontAwesomeIcon
                  tw="h-3 w-3 block"
                  aria-hidden="true"
                  icon={faCheckCircle}
                />
              </div>
            </div>
          ),
        },
      ]}
    />
  );
}
