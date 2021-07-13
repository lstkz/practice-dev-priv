import React from 'react';
import { Tabs } from '../../components/Tabs';
import {
  ChallengeTab,
  useChallengeActions,
  useChallengeState,
} from './ChallengeModule';

export function ChallengeTabs() {
  const { setChallengeTab } = useChallengeActions();
  const { challengeTab } = useChallengeState();
  return (
    <Tabs<ChallengeTab>
      selected={challengeTab}
      onSelect={setChallengeTab}
      tabs={[
        { name: 'details', title: 'Details' },
        { name: 'solutions', title: 'Solutions', count: 6 },
        { name: 'test_suite', title: 'Test Suite' },
        { name: 'submissions', title: 'Submissions' },
      ]}
    />
  );
}
