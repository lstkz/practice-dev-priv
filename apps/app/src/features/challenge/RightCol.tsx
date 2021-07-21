import React from 'react';
import { useChallengeState } from './ChallengeModule';
import { EmbeddedIframe } from './EmbeddedIframe';
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
      <WebNavigator shallowHidden={rightSidebarTab !== 'preview'}>
        <EmbeddedIframe />
      </WebNavigator>
      {/* <WebNavigator shallowHidden={rightSidebarTab !== 'demo'}>
        <EmbeddedIframe />
      </WebNavigator> */}
    </div>
  );
}
