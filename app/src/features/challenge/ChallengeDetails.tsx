import React from 'react';
import { ChallengeTabs } from './ChallengeTabs';
import { DetailsTab } from './DetailsTab';

export function ChallengeDetails() {
  return (
    <div tw="h-full flex flex-col">
      <div tw="flex">
        <ChallengeTabs />
      </div>
      <div tw="bg-gray-50 p-3 flex-1">
        <DetailsTab />
      </div>
    </div>
  );
}
