import React from 'react';
import { IFRAME_ORIGIN } from 'src/config';
import { useChallengeState } from './ChallengeModule';
import { PreviewIframe } from './PreviewIframe';
import { SolutionIframe } from './SolutionIframe';
import { WebNavigator } from './WebNavigator';

export function RightCol() {
  const { rightSidebarTab, challenge } = useChallengeState();
  const isDragging = false;
  return (
    <div
      tw="h-full flex flex-col"
      style={{
        pointerEvents: isDragging ? 'none' : undefined,
      }}
    >
      <WebNavigator
        name="PreviewNavigator"
        shallowHidden={rightSidebarTab !== 'preview'}
        origin={IFRAME_ORIGIN}
      >
        <PreviewIframe />
      </WebNavigator>
      <WebNavigator
        name="DemoNavigator"
        shallowHidden={rightSidebarTab !== 'demo'}
        origin={challenge.solutionUrl}
      >
        <SolutionIframe />
      </WebNavigator>
    </div>
  );
}
