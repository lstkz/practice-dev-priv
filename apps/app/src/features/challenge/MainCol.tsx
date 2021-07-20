import React from 'react';
import { EditorTabs } from './editor/EditorTabs';
import { EditorWrapper } from './editor/EditorWrapper';

export function MainCol() {
  return (
    <div
      tw="h-full border-l border-gray-800"
      style={{
        background: '#011627',
      }}
    >
      <EditorTabs />
      <EditorWrapper />
    </div>
  );
}
