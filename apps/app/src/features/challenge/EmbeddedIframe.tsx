import React from 'react';
import { IFRAME_ORIGIN } from 'src/config';
import { useEditorActions } from './editor/EditorModule';

export function EmbeddedIframe() {
  const { registerPreviewIFrame } = useEditorActions();
  const iframeRef = React.useRef(null! as HTMLIFrameElement);

  React.useEffect(() => {
    registerPreviewIFrame(iframeRef.current);
  }, []);

  return (
    <iframe
      src={IFRAME_ORIGIN}
      ref={iframeRef}
      style={{ width: '100%', height: '100%' }}
    ></iframe>
  );
}
