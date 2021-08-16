import Link from 'next/link';
import React from 'react';
import { Follower, User } from 'shared';
import { createUrl } from 'src/common/url';
import { UserAvatar } from 'src/components/UserAvatar';
import { FollowButton } from './FollowButton';

interface FollowerItemProps {
  loggedUser: User;
  follower: Follower;
  toggleFollow: (follower: Follower) => Promise<void>;
}

export function FollowerItem(props: FollowerItemProps) {
  const { loggedUser, follower, toggleFollow } = props;
  return (
    <li className="py-4">
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          <UserAvatar user={follower} />
        </div>
        <div className="flex-1 min-w-0">
          {follower.name ? (
            <>
              <Link
                passHref
                href={createUrl({
                  name: 'profile',
                  username: follower.username,
                })}
              >
                <a tw="text-gray-800 font-semibold">{follower.name}</a>
              </Link>
              <p className="text-sm font-medium text-gray-500 truncate leading-snug">
                @{follower.username}
              </p>
            </>
          ) : (
            <Link
              passHref
              href={createUrl({ name: 'profile', username: follower.username })}
            >
              <a tw="text-gray-800 font-semibold">@{follower.username}</a>
            </Link>
          )}
        </div>
        {loggedUser && loggedUser.id !== follower.id && (
          <FollowButton
            isFollowing={follower.isFollowing}
            onToggle={() => toggleFollow(follower)}
          />
        )}
      </div>
    </li>
  );
}
