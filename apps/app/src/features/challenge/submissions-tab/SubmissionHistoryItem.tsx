import React from 'react';
import * as DateFns from 'date-fns';
import { Submission } from 'shared';
import { Button } from 'src/components/Button';
import { useChallengeActions } from '../ChallengeModule';
import { useErrorModalActions } from '../../ErrorModalModule';
import { SubmissionStatusBadge } from 'src/components/SubmissionStatusBadge';

interface SubmissionHistoryItemProps {
  item: Submission;
}

export function SubmissionHistoryItem(props: SubmissionHistoryItemProps) {
  const { item } = props;
  const { openSubmission } = useChallengeActions();
  const { showError } = useErrorModalActions();
  const [isLoading, setIsLoading] = React.useState(false);
  return (
    <li tw="py-4">
      <div tw="flex items-center space-x-4">
        <SubmissionStatusBadge status={item.status} />
        <div tw="flex-1 min-w-0">
          <p tw="text-sm text-gray-400 truncate">
            {DateFns.format(new Date(item.createdAt), 'HH:mm dd/MM/yyyy')}
          </p>
        </div>
        <div tw="flex items-center">
          <Button
            type="light"
            size="small"
            focusBg="gray-900"
            loading={isLoading}
            onClick={async () => {
              try {
                setIsLoading(true);
                await openSubmission(item);
              } catch (e) {
                showError(e);
                setIsLoading(false);
              }
            }}
          >
            Load
          </Button>
        </div>
      </div>
    </li>
  );
}
