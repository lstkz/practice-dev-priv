import React from 'react';
import { ConfirmModal } from 'src/components/ConfirmModal';
import { Button } from '../../components/Button';
import { Logo } from '../../components/Logo';
import { useChallengeActions, useChallengeState } from './ChallengeModule';
import { useEditorActions, useEditorState } from './editor/EditorModule';

interface ForkBarProps {
  onFork: () => void;
  onClose: () => void;
  title: React.ReactNode;
}

function ForkBar(props: ForkBarProps) {
  const { onFork, onClose, title } = props;
  return (
    <div tw="flex text-gray-200 text-sm space-x-2 items-center">
      <span>{title}</span>
      <Button type="primary" size="small" focusBg="gray-800" onClick={onFork}>
        Fork
      </Button>
      <Button type="white" size="small" focusBg="gray-800" onClick={onClose}>
        Close
      </Button>
    </div>
  );
}

export function ChallengeHeader() {
  const { submit } = useEditorActions();
  const { isSubmitting } = useEditorState();
  const { openedSubmission, openedSolution } = useChallengeState();
  const { closeReadOnlyWorkspace, fork } = useChallengeActions();
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);
  return (
    <div tw="bg-gray-800 h-10 flex items-center px-2 flex-shrink-0">
      <ConfirmModal
        title="Are you sure to fork?"
        children="Your all existing files will be overwritten."
        yesContent="Fork"
        noContent="Cancel"
        close={() => {
          setIsConfirmOpen(false);
        }}
        confirm={() => {
          setIsConfirmOpen(false);
          fork();
        }}
        isOpen={isConfirmOpen}
      />
      <Logo tw="h-5" href="/module/1" />
      <div tw="ml-auto">
        {openedSubmission ? (
          <ForkBar
            title="You are viewing a past submission"
            onFork={() => setIsConfirmOpen(true)}
            onClose={closeReadOnlyWorkspace}
          />
        ) : openedSolution ? (
          <ForkBar
            title={<>Solution: {openedSolution.title}</>}
            onFork={() => setIsConfirmOpen(true)}
            onClose={closeReadOnlyWorkspace}
          />
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
