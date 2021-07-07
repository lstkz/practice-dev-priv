import React from 'react';
import { LeftCol } from './LeftCol';
import { ChallengeHeader } from './ChallengeHeader';
import { useChallengeActions, useChallengeState } from './ChallengeModule';
import { EditorWrapper } from './EditorWrapper';
import { LeftSidebar } from './LeftSidebar';
import { RightSidebar } from './RightSidebar';
import { RightCol } from './RightCol';
import { LayoutManager } from './LayoutManager';

export function ChallengePage() {
  const {} = useChallengeActions();
  const { leftSidebarTab, rightSidebarTab } = useChallengeState();

  return (
    <div tw="h-full flex flex-col">
      <ChallengeHeader />
      <div tw="flex flex-1 h-full ">
        <LeftSidebar />
        <LayoutManager
          left={<LeftCol />}
          hasLeft={leftSidebarTab != null}
          main={<EditorWrapper />}
          right={<RightCol />}
          hasRight={rightSidebarTab != null}
        />
        <RightSidebar />
      </div>
    </div>
  );
}
