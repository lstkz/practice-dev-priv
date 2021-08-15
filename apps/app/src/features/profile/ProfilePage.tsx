import React from 'react';
import Dashboard from '../../components/Dashboard';
import { useProfileState } from './ProfileModule';
import { UserActivityFeed } from './UserActivityFeed';
import { Container } from '../../components/Container';
import { ProfileHeader } from './ProfileHeader';
import { Tabs } from '../../components/Tabs';
import { OverviewTab } from './OverviewTab';
import { SolutionsTab } from './SolutionsTab';
import { SubmissionsTab } from './SubmissionsTab';
import { FollowersTab } from './FollowersTab';

export function ProfilePage() {
  const { profile } = useProfileState();
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
                    count: profile.solutions,
                  },
                  {
                    name: 'submissions',
                    title: 'Submissions',
                    count: profile.submissions,
                  },
                  {
                    name: 'followers',
                    title: 'Followers',
                    count: profile.followers,
                  },
                ]}
              />
              <div>
                {tab === 'overview' && <OverviewTab />}
                {tab === 'solutions' && <SolutionsTab />}
                {tab === 'submissions' && <SubmissionsTab />}
                {tab === 'followers' && <FollowersTab />}
              </div>
            </div>
          </div>
          <UserActivityFeed />
        </div>
      </Container>
    </Dashboard>
  );
}
