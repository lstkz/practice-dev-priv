import React from 'react';
import { EditorWrapper } from './EditorWrapper';
import { FileTab } from './FileTab';

export function MainCol() {
  return (
    <div
      tw="h-full border-l border-gray-800"
      style={{
        background: '#011627',
      }}
    >
      <div tw="flex space-x-0.5">
        <FileTab name="index.tsx" isActive hasChanges />
        <FileTab name="Button.tsx" />
        <FileTab name="util.ts" hasChanges />
      </div>
      <EditorWrapper />
    </div>
  );
}
