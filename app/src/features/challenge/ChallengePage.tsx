import React from 'react';
import { BrowserPreview } from './BrowserPreview';
import { ChallengeDetails } from './ChallengeDetails';
import { ChallengeHeader } from './ChallengeHeader';
import { useChallengeActions, useChallengeState } from './ChallengeModule';
import { EditorWrapper } from './EditorWrapper';

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
        <div style={{ width: 100 / 3 + '%' }}>
          <EditorWrapper />
        </div>
        <div style={{ width: 100 / 3 + '%' }}>
          <BrowserPreview />
        </div>
      </div>
    </div>
  );
}
