import React from 'react';
import { UserAvatar } from 'src/components/UserAvatar';
import { useUser } from '../AuthModule';
import { FollowButton } from './FollowButton';
import { useProfileActions, useProfileState } from './ProfileModule';

export function ProfileHeader() {
  const { profile } = useProfileState();
  const { follow, unfollow } = useProfileActions();
  const user = useUser();
  return (
    <div tw="md:flex md:items-center md:justify-between md:space-x-5">
      <div tw="flex items-center space-x-5">
        <div tw="flex-shrink-0">
          <div tw="relative">
            <UserAvatar size="xl" user={profile} />
          </div>
        </div>
        <div>
          {profile.name ? (
            <>
              <h1 tw="text-2xl font-bold text-gray-900">{profile.name}</h1>
              <p tw="text-sm font-medium text-gray-500">@{profile.username}</p>
            </>
          ) : (
            <h1 tw="text-xl font-bold text-gray-900">@{profile.username}</h1>
          )}
        </div>
      </div>
      {user && user.id !== profile.id && (
        <div tw="mt-6 md:mt-0">
          <FollowButton
            isFollowing={profile.isFollowing}
            onToggle={async () => {
              if (profile.isFollowing) {
                await unfollow();
              } else {
                await follow();
              }
            }}
          />
        </div>
      )}
    </div>
  );
}
