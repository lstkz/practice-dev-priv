import React from 'react';
import { LeftCol } from './LeftCol';
import { ChallengeHeader } from './ChallengeHeader';
import { useChallengeActions, useChallengeState } from './ChallengeModule';
import { MainCol } from './MainCol';
import { LeftSidebar } from './LeftSidebar';
import { RightSidebar } from './RightSidebar';
import { RightCol } from './RightCol';
import { LayoutManager } from './LayoutManager';
import { MobileTabs } from './MobileTabs';
import { useIDETabView } from 'src/hooks/useIsIDETabView';
import { IS_SSR } from 'src/config';

export function ChallengePage() {
  const {} = useChallengeActions();
  const {
    leftSidebarTab,
    rightSidebarTab,
    initialLeftSidebar,
    initialRightSidebar,
  } = useChallengeState();
  const [overflow, setOverflow] = React.useState<string | undefined>('hidden');
  React.useEffect(() => {
    const id = setTimeout(() => {
      setOverflow(undefined);
    }, 0);
    return () => {
      clearTimeout(id);
    };
  }, []);
  const [ideNode] = React.useState<HTMLDivElement>(() => {
    if (IS_SSR) {
      return null!;
    }
    const node = document.createElement('div');
    node.style.height = '100%';
    return node;
  });
  const isTabView = useIDETabView();
  const height = `calc(100% - 2.5rem)`;
  return (
    <div tw="h-full flex flex-col">
      <ChallengeHeader isTabView={isTabView} />
      {isTabView ? (
        <div style={{ height }}>
          <MobileTabs />
        </div>
      ) : (
        <div tw="flex" style={{ height, overflow }}>
          <LeftSidebar />
          <LayoutManager
            initialLeftSidebar={initialLeftSidebar}
            initialRightSidebar={initialRightSidebar}
            left={<LeftCol />}
            hasLeft={leftSidebarTab != null}
            main={<MainCol ideNode={ideNode} />}
            right={<RightCol />}
            hasRight={rightSidebarTab != null}
          />
          <RightSidebar />
        </div>
      )}
    </div>
  );
}
