import React from 'react';
import * as DateFns from 'date-fns';
import { Submission, SubmissionStatus } from 'shared';
import Badge from 'src/components/Badge';
import { Button } from 'src/components/Button';

interface SubmissionHistoryItemProps {
  item: Submission;
}

export function SubmissionHistoryItem(props: SubmissionHistoryItemProps) {
  const { item } = props;
  return (
    <li tw="py-4">
      <div tw="flex items-center space-x-4">
        <Badge
          dark
          color={
            item.status === SubmissionStatus.Fail
              ? 'red'
              : item.status === SubmissionStatus.Pass
              ? 'green'
              : 'gray'
          }
        >
          {item.status.toUpperCase()}
        </Badge>
        <div tw="flex-1 min-w-0">
          <p tw="text-sm text-gray-400 truncate">
            {DateFns.format(new Date(item.createdAt), 'HH:mm dd/MM/yyyy')}
          </p>
        </div>
        <div tw="flex items-center">
          <Button type="light" size="small" focusBg="gray-900">
            Load
          </Button>
        </div>
      </div>
    </li>
  );
}
