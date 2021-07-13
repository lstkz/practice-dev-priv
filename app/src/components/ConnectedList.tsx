import React from 'react';

interface ConnectedListProps {
  children: React.ReactNode;
}

export function ConnectedList(props: ConnectedListProps) {
  const { children } = props;
  return (
    <div tw="bg-white shadow overflow-hidden sm:rounded-md">
      <ul tw="divide-y divide-gray-200">{children}</ul>
    </div>
  );
}
