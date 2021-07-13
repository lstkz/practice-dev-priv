import React from 'react';
import { Container } from '../../components/Container';
import Dashboard from '../../components/Dashboard';
import { useSettingsActions, useSettingsState } from './SettingsModule';
import { SettingsNavigation } from './SettingsNavigation';
import { ProfileSection } from './ProfileSection';
import { AccountSection } from './AccountSection';
import { PasswordSection } from './PasswordSection';
import { NotificationsSection } from './NotificationsSection';

export function SettingsPage() {
  const {} = useSettingsActions();
  const { tab } = useSettingsState();
  return (
    <Dashboard>
      <Container>
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-5 pb-20">
          <SettingsNavigation />
          <div className="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
            {tab === 'profile' && <ProfileSection />}
            {tab === 'account' && <AccountSection />}
            {tab === 'password' && <PasswordSection />}
            {tab === 'notifications' && <NotificationsSection />}
          </div>
        </div>
      </Container>
    </Dashboard>
  );
}
