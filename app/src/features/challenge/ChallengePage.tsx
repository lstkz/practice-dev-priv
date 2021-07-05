import React from 'react';
import { ChallengeDetails } from './ChallengeDetails';
import { ChallengeHeader } from './ChallengeHeader';
import { useChallengeActions, useChallengeState } from './ChallengeModule';

export function ChallengePage() {
  const {} = useChallengeActions();
  const {} = useChallengeState();
  return (
    <div tw="h-full flex flex-col">
      <ChallengeHeader />
      <div tw="flex flex-1">
        <div style={{ width: 100 / 3 + '%' }}>
          <ChallengeDetails />
        </div>
        <div style={{ width: 100 / 3 + '%' }}></div>
        <div style={{ width: 100 / 3 + '%' }}></div>
      </div>
    </div>
  );
}
