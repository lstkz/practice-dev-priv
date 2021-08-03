import React from 'react';
import { IFRAME_ORIGIN } from 'src/config';
import { useChallengeState } from './ChallengeModule';
import { PreviewIframe } from './PreviewIframe';
import { SolutionIframe } from './SolutionIframe';
import { WebNavigator } from './WebNavigator';

export function RightCol() {
  const { rightSidebarTab } = useChallengeState();
  const isDragging = false;
  return (
    <div
      tw="h-full flex flex-col"
      style={{
        pointerEvents: isDragging ? 'none' : undefined,
      }}
    >
      <WebNavigator
        shallowHidden={rightSidebarTab !== 'preview'}
        origin={IFRAME_ORIGIN}
      >
        <PreviewIframe />
      </WebNavigator>
      <WebNavigator shallowHidden={rightSidebarTab !== 'demo'} origin="*">
        <SolutionIframe />
      </WebNavigator>
    </div>
  );
}
