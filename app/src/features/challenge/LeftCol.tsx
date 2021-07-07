import React from 'react';
import { useChallengeState } from './ChallengeModule';
import { ChallengeTabs } from './ChallengeTabs';
import { DetailsTab } from './DetailsTab';
import { SolutionsTab } from './SolutionsTab';

export function LeftCol() {
  const { challengeTab } = useChallengeState();
  return (
    <div tw="h-full flex flex-col bg-gray-900">
      <div tw="flex">{/* <ChallengeTabs /> */}</div>
      <div tw="p-3 flex-1">
        {challengeTab === 'details' && <DetailsTab />}
        {challengeTab === 'solutions' && <SolutionsTab />}
      </div>
    </div>
  );
}
