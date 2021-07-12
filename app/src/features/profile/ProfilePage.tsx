import React from 'react';
import Dashboard from '../../components/Dashboard';
import { useProfileActions, useProfileState } from './ProfileModule';
import { UserTimeline } from './UserTimeline';
import { Container } from '../../components/Container';
import { ProfileHeader } from './ProfileHeader';
import { Tabs } from '../../components/Tabs';
import { OverviewTab } from './OverviewTab';
import { SolutionsTab } from './SolutionsTab';
import { SubmissionsTab } from './SubmissionsTab';

export function ProfilePage() {
  const {} = useProfileActions();
  const {} = useProfileState();
  const [tab, setTab] = React.useState('overview');
  return (
    <Dashboard>
      <Container>
        <ProfileHeader />
        <div className="mt-8 max-w-3xl mx-auto grid grid-cols-1 gap-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-3 pb-20">
          <div className="space-y-6 lg:col-start-1 lg:col-span-2">
            <div className="bg-white shadow sm:rounded-lg pt-2">
              <Tabs
                selected={tab}
                onSelect={setTab}
                tabs={[
                  {
                    name: 'overview',
                    title: 'Overview',
                  },
                  {
                    name: 'solutions',
                    title: 'Solutions',
                    count: 50,
                  },
                  {
                    name: 'submissions',
                    title: 'Submissions',
                    count: '2k',
                  },
                  {
                    name: 'followers',
                    title: 'Followers',
                    count: 100,
                  },
                ]}
              />
              <div>
                {tab === 'overview' && <OverviewTab />}
                {tab === 'solutions' && <SolutionsTab />}
                {tab === 'submissions' && <SubmissionsTab />}
              </div>
            </div>
          </div>
          <UserTimeline />
        </div>
      </Container>
    </Dashboard>
  );
}
