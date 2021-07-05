import React from 'react';
import { Tabs } from '../../components/Tabs';

export function ChallengeTabs() {
  return (
    <Tabs
      selected="details"
      onSelect={value => {}}
      tabs={[
        { name: 'details', title: 'Details' },
        { name: 'solution', title: 'Solutions', count: 6 },
        { name: 'test_suite', title: 'Test Suite' },
        { name: 'submissions', title: 'Submissions' },
      ]}
    />
  );
}
