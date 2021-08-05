import React from 'react';
import { Button } from '../../components/Button';
import { Logo } from '../../components/Logo';
import { useEditorActions, useEditorState } from './editor/EditorModule';

export function ChallengeHeader() {
  const { submit } = useEditorActions();
  const { isSubmitting } = useEditorState();
  return (
    <div tw="bg-gray-800 h-10 flex items-center px-2 flex-shrink-0">
      <Logo tw="h-5" href="/module/1" />
      <Button
        loading={isSubmitting}
        onClick={submit}
        tw="ml-auto"
        type="primary"
        size="small"
        focusBg="gray-800"
      >
        Submit
      </Button>
    </div>
  );
}
