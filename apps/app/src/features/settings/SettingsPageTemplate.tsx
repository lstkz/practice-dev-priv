import React from 'react';
import { Container } from '../../components/Container';
import Dashboard from '../../components/Dashboard';
import { SettingsNavigation } from './SettingsNavigation';

interface SettingsPageTemplateProps {
  children: React.ReactNode;
}

export function SettingsPageTemplate(props: SettingsPageTemplateProps) {
  const { children } = props;
  return (
    <Dashboard>
      <Container>
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-5 pb-20">
          <SettingsNavigation />
          <div className="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
            {children}
          </div>
        </div>
      </Container>
    </Dashboard>
  );
}
