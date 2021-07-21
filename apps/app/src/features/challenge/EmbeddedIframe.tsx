import React from 'react';
import { useEditorActions } from './editor/EditorModule';

export function EmbeddedIframe() {
  const { registerPreviewIFrame } = useEditorActions();
  const iframeRef = React.useRef(null! as HTMLIFrameElement);

  React.useEffect(() => {
    registerPreviewIFrame(iframeRef.current);
  }, []);

  return <iframe src="http://localhost:4010" ref={iframeRef}></iframe>;
}
