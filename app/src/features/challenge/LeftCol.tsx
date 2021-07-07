import React from 'react';
import { useChallengeState } from './ChallengeModule';
import { DetailsTab } from './DetailsTab';
import { SolutionsTab } from './SolutionsTab';
import { TestSuiteTab } from './TestSuiteTab';

export function LeftCol() {
  const { leftSidebarTab } = useChallengeState();
  return (
    <div tw="h-full flex flex-col bg-gray-900 p-3">
      {leftSidebarTab === 'details' && <DetailsTab />}
      {leftSidebarTab === 'solutions' && <SolutionsTab />}
      {leftSidebarTab === 'test-suite' && <TestSuiteTab />}
    </div>
  );
}
