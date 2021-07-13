import React from 'react';
import { AccountEmailSection } from './AccountEmailSection';
import { AccountUsernameSection } from './AccountUsernameSection';

export function AccountSection() {
  return (
    <>
      <AccountUsernameSection />
      <AccountEmailSection />
    </>
  );
}
