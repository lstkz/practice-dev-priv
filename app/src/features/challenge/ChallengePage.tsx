import React from 'react';
import { BrowserPreview } from './BrowserPreview';
import { LeftCol } from './LeftCol';
import { ChallengeHeader } from './ChallengeHeader';
import { useChallengeActions, useChallengeState } from './ChallengeModule';
import { EditorWrapper } from './EditorWrapper';
import { LeftSidebar } from './LeftSidebar';
import { RightSidebar } from './RightSidebar';
import { RightCol } from './RightCol';

export function ChallengePage() {
  const {} = useChallengeActions();
  const {} = useChallengeState();

  return (
    <div tw="h-full flex flex-col">
      <ChallengeHeader />
      <div tw="flex flex-1">
        <LeftSidebar />
        <div tw="flex-1 flex">
          <div style={{ width: (1 / 3) * 100 + '%' }}>
            <div tw="flex h-full">
              <LeftCol />
            </div>
          </div>
          <div style={{ width: (1 / 3) * 100 + '%', height: '100%' }}>
            <EditorWrapper />
          </div>
          <div style={{ width: (1 / 3) * 100 + '%' }}>
            <RightCol />
          </div>
        </div>
        <RightSidebar />
      </div>
    </div>
  );
}
