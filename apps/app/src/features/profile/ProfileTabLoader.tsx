import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

export function ProfileTabLoader() {
  return (
    <div tw="flex h-3/4 items-center justify-center py-12">
      <FontAwesomeIcon
        tw="text-indigo-500 text-5xl animate-spin-slow"
        icon={faSpinner}
      />
    </div>
  );
}
