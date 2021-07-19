import React from 'react';
import { SettingsPageTemplate } from '../SettingsPageTemplate';
import { AccountEmailSection } from './AccountEmailSection';
import { AccountUsernameSection } from './AccountUsernameSection';

export function AccountPage() {
  return (
    <SettingsPageTemplate>
      <AccountUsernameSection />
      <AccountEmailSection />
    </SettingsPageTemplate>
  );
}
