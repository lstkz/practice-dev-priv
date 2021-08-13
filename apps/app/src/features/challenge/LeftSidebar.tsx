import React from 'react';
import { ChallengeSidebar } from './ChallengeSidebar';
import {
  faCopy,
  faInfoCircle,
  faTasks,
  faLightbulb,
  faHistory,
} from '@fortawesome/free-solid-svg-icons';
import { useChallengeActions, useChallengeState } from './ChallengeModule';
import { useUser } from '../AuthModule';

export function LeftSidebar() {
  const { setLeftSidebarTab } = useChallengeActions();
  const { leftSidebarTab } = useChallengeState();
  const user = useUser();
  return (
    <ChallengeSidebar
      tooltipPlace="right"
      onSelect={name => {
        if (leftSidebarTab === name) {
          setLeftSidebarTab(null);
        } else {
          setLeftSidebarTab(name);
        }
      }}
      items={[
        {
          name: 'details',
          label: 'Details',
          fa: faInfoCircle,
          current: leftSidebarTab === 'details',
        },
        user && {
          name: 'file-explorer',
          label: 'File Explorer',
          fa: faCopy,
          current: leftSidebarTab === 'file-explorer',
        },
        {
          name: 'test-suite',
          label: 'Test Suite',
          fa: faTasks,
          current: leftSidebarTab === 'test-suite',
        },
        {
          name: 'solutions',
          label: 'Solutions',
          fa: faLightbulb,
          current: leftSidebarTab === 'solutions',
        },
        user && {
          name: 'submission-history',
          label: 'Submission History',
          fa: faHistory,
          current: leftSidebarTab === 'submission-history',
        },
      ]}
    />
  );
}
