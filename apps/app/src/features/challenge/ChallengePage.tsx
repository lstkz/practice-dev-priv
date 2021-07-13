import React from 'react';
import { LeftCol } from './LeftCol';
import { ChallengeHeader } from './ChallengeHeader';
import { useChallengeActions, useChallengeState } from './ChallengeModule';
import { MainCol } from './MainCol';
import { LeftSidebar } from './LeftSidebar';
import { RightSidebar } from './RightSidebar';
import { RightCol } from './RightCol';
import { LayoutManager } from './LayoutManager';

export function ChallengePage() {
  const {} = useChallengeActions();
  const {
    leftSidebarTab,
    rightSidebarTab,
    initialLeftSidebar,
    initialRightSidebar,
  } = useChallengeState();

  return (
    <div tw="h-full flex flex-col">
      <ChallengeHeader />
      <div tw="flex" style={{ height: `calc(100% - 2.5rem)` }}>
        <LeftSidebar />
        <LayoutManager
          initialLeftSidebar={initialLeftSidebar}
          initialRightSidebar={initialRightSidebar}
          left={<LeftCol />}
          hasLeft={leftSidebarTab != null}
          main={<MainCol />}
          right={<RightCol />}
          hasRight={rightSidebarTab != null}
        />
        <RightSidebar />
      </div>
    </div>
  );
}
