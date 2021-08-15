import tw from 'twin.macro';
import * as DateFns from 'date-fns';
import { useProfileState } from './ProfileModule';

interface StatsProps {
  label: React.ReactNode;
  children: React.ReactNode;
  double?: boolean;
}

function Stats(props: StatsProps) {
  const { children, label, double } = props;
  return (
    <div css={[double ? tw`sm:col-span-2` : tw`sm:col-span-1`]}>
      <dt tw="text-sm font-medium text-gray-500">{label}</dt>
      <dd tw="mt-1 text-sm text-gray-900">{children}</dd>
    </div>
  );
}

export function OverviewTab() {
  const { profile } = useProfileState();
  return (
    <div className=" px-4 py-5 sm:px-6">
      <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
        <Stats label="Rank">TBD</Stats>
        <Stats label="Crypto">TBD</Stats>
        <Stats label="Submissions">{profile.submissions}</Stats>
        <Stats label="Solutions">{profile.solutions}</Stats>
        <Stats label="Following">{profile.following}</Stats>
        <Stats label="Followers">{profile.followers}</Stats>
        <Stats label="Member Since">
          {DateFns.format(new Date(profile.memberSince), 'dd MMM yyyy')}
        </Stats>
        <Stats label="Last Seen">
          {DateFns.format(new Date(profile.lastSeen), 'dd MMM yyyy')}
        </Stats>
        <Stats label="About" double>
          {profile.about}
        </Stats>
      </dl>
    </div>
  );
}
