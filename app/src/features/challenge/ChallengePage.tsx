import React from 'react';
import { BrowserPreview } from './BrowserPreview';
import { LeftCol } from './LeftCol';
import { ChallengeHeader } from './ChallengeHeader';
import { useChallengeActions, useChallengeState } from './ChallengeModule';
import { EditorWrapper } from './EditorWrapper';
import { LeftSidebar } from './LeftSidebar';

export function ChallengePage() {
  const {} = useChallengeActions();
  const {} = useChallengeState();

  return (
    <div tw="h-full flex flex-col">
      <ChallengeHeader />
      <div tw="flex flex-1">
        <div style={{ width: (1 / 3) * 100 + '%' }}>
          <div tw="flex h-full">
            <LeftSidebar />
            <div tw="h-full flex-1">
              <LeftCol />
            </div>
          </div>
        </div>
        <div style={{ width: (1 / 3) * 100 + '%', height: '100%' }}>
          <EditorWrapper />
        </div>
        <div style={{ width: (1 / 3) * 100 + '%' }}>
          <BrowserPreview isDragging={false} />
        </div>
      </div>
    </div>
  );
}