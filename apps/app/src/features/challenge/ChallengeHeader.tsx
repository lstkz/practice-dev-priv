import React from 'react';
import { Button } from '../../components/Button';
import { Logo } from '../../components/Logo';
import { useChallengeActions, useChallengeState } from './ChallengeModule';
import { useEditorActions, useEditorState } from './editor/EditorModule';

export function ChallengeHeader() {
  const { submit } = useEditorActions();
  const { isSubmitting } = useEditorState();
  const { openedSubmission } = useChallengeState();
  const { forkSubmission, closeSubmission } = useChallengeActions();
  return (
    <div tw="bg-gray-800 h-10 flex items-center px-2 flex-shrink-0">
      <Logo tw="h-5" href="/module/1" />
      <div tw="ml-auto">
        {openedSubmission ? (
          <div tw="flex text-gray-200 text-sm space-x-2 items-center">
            <span>You are viewing a past submission</span>
            <Button
              type="primary"
              size="small"
              focusBg="gray-800"
              onClick={forkSubmission}
            >
              Fork
            </Button>
            <Button
              type="white"
              size="small"
              focusBg="gray-800"
              onClick={closeSubmission}
            >
              Close
            </Button>
          </div>
        ) : (
          <Button
            loading={isSubmitting}
            onClick={submit}
            type="primary"
            size="small"
            focusBg="gray-800"
          >
            Submit
          </Button>
        )}
      </div>
    </div>
  );
}
