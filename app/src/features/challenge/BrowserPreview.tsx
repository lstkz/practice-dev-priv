import React from 'react';
import { Tabs } from '../../components/Tabs';
import { EmbeddedIframe } from './EmbeddedIframe';
import { WebNavigator } from './WebNavigator';

interface BrowserPreviewProps {
  isDragging: boolean;
}

export function BrowserPreview(props: BrowserPreviewProps) {
  const { isDragging } = props;
  const [tab, setTab] = React.useState('preview');
  return (
    <div
      tw="h-full flex flex-col"
      style={{
        pointerEvents: isDragging ? 'none' : undefined,
      }}
    >
      <div>
        <Tabs
          selected={tab}
          onSelect={setTab}
          tabs={[
            { name: 'preview', title: 'Preview' },
            { name: 'demo', title: 'Demo' },
          ]}
        />
      </div>
      <WebNavigator shallowHidden={tab !== 'preview'}>
        <EmbeddedIframe />
      </WebNavigator>
      <WebNavigator shallowHidden={tab !== 'demo'}>
        <EmbeddedIframe />
      </WebNavigator>
    </div>
  );
}
