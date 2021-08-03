import React from 'react';
import { useChallengeState } from './ChallengeModule';
import { useWebNavigatorActions } from './WebNavigator';

export function SolutionIframe() {
  const { challenge } = useChallengeState();
  const iframeRef = React.useRef(null! as HTMLIFrameElement);
  const { registerIframe } = useWebNavigatorActions();

  React.useEffect(() => {
    registerIframe(iframeRef.current);
  }, []);

  return (
    <iframe
      sandbox="allow-same-origin allow-modals allow-scripts allow-popups allow-forms"
      src={challenge.solutionUrl}
      ref={iframeRef}
      style={{ width: '100%', height: '100%' }}
    ></iframe>
  );
}
