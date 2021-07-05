import React from 'react';
import { Button } from '../../components/Button';
import { Logo } from '../../components/Logo';

interface ChallengeHeaderProps {}

export function ChallengeHeader() {
  return (
    <div tw="bg-gray-800 h-10 flex items-center px-2">
      <Logo tw="h-5" href="/module/1" />
      <Button tw="ml-auto" type="primary" size="small">
        Submit
      </Button>
    </div>
  );
}
