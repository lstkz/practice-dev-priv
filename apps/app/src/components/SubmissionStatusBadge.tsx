import React from 'react';
import { SubmissionStatus } from 'shared';
import Badge from './Badge';

interface SubmissionStatusBadgeProps {
  status: SubmissionStatus;
}

export function SubmissionStatusBadge(props: SubmissionStatusBadgeProps) {
  const { status } = props;
  return (
    <Badge
      color={
        status === SubmissionStatus.Fail
          ? 'red'
          : status === SubmissionStatus.Pass
          ? 'green'
          : 'gray'
      }
    >
      {status.toUpperCase()}
    </Badge>
  );
}
