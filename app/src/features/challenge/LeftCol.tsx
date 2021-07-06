import React from 'react';
import { useChallengeState } from './ChallengeModule';
import { ChallengeTabs } from './ChallengeTabs';
import { DetailsTab } from './DetailsTab';
import { SolutionsTab } from './SolutionsTab';

export function LeftCol() {
  const { challengeTab } = useChallengeState();
  return (
    <div tw="h-full flex flex-col">
      <div tw="flex">
        <ChallengeTabs />
      </div>
      <div tw="bg-gray-50 p-3 flex-1">
        {challengeTab === 'details' && <DetailsTab />}
        {challengeTab === 'solutions' && <SolutionsTab />}
      </div>
    </div>
  );
}
