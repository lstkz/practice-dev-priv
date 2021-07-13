import React from 'react';
import { useChallengeState } from './ChallengeModule';
import { DetailsTab } from './DetailsTab';
import { FileExplorerTab } from './FileExplorerTab';
import { SolutionsTab } from './SolutionsTab';
import { SubmissionHistoryTab } from './SubmissionHistoryTab';
import { TestSuiteTab } from './TestSuiteTab';

export function LeftCol() {
  const { leftSidebarTab } = useChallengeState();
  return (
    <div tw="h-full flex flex-col bg-gray-900 p-3 overflow-auto">
      {leftSidebarTab === 'details' && <DetailsTab />}
      {leftSidebarTab === 'solutions' && <SolutionsTab />}
      {leftSidebarTab === 'test-suite' && <TestSuiteTab />}
      {leftSidebarTab === 'file-explorer' && <FileExplorerTab />}
      {leftSidebarTab === 'submission-history' && <SubmissionHistoryTab />}
    </div>
  );
}
