import React from 'react';
import { Tooltip } from './Tooltip';

interface IconStatsProps {
  icon: React.ReactNode;
  children: React.ReactNode;
  tooltip: string;
}

export function IconStats(props: IconStatsProps) {
  const { icon, tooltip, children } = props;

  return (
    <Tooltip tw="flex items-center text-sm text-gray-500" tooltip={tooltip}>
      <span tw="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true">
        {icon}
      </span>
      <span>{children}</span>
    </Tooltip>
  );
}
