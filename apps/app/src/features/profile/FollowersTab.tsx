import { useImmer } from 'context-api';
import React from 'react';
import { Follower } from 'shared';
import { api } from 'src/services/api';
import { Button } from '../../components/Button';
import { useUser } from '../AuthModule';
import { useErrorModalActions } from '../ErrorModalModule';
import { FollowerItem } from './FollowerItem';
import { useProfileState } from './ProfileModule';
import { ProfileTabLoader } from './ProfileTabLoader';

interface State {
  isLoaded: boolean;
  isLoadMore: boolean;
  total: number;
  items: Follower[];
}

export function FollowersTab() {
  const [state, setState, getState] = useImmer<State>(
    {
      isLoaded: false,
      isLoadMore: false,
      total: 0,
      items: [],
    },
    'Followers'
  );
  const user = useUser();
  const { profile } = useProfileState();
  const { showError } = useErrorModalActions();
  const search = async (loadMore?: boolean) => {
    try {
      const { items, total } = await api.follower_searchFollowers({
        offset: loadMore ? getState().items.length : 0,
        limit: 20,
        username: profile.username,
      });
      setState(draft => {
        draft.isLoaded = true;
        draft.isLoadMore = false;
        draft.total = total;
        if (loadMore) {
          draft.items.push(...items);
        } else {
          draft.items = items;
        }
      });
    } catch (e) {
      showError(e);
      setState(draft => {
        draft.isLoadMore = false;
      });
    }
  };
  const toggleFollow = async (follower: Follower) => {
    try {
      if (follower.isFollowing) {
        await api.follower_unfollowUser(follower.username);
      } else {
        await api.follower_followUser(follower.username);
      }
      setState(draft => {
        draft.items.forEach(item => {
          if (item.id === follower.id) {
            item.isFollowing = !item.isFollowing;
          }
        });
      });
    } catch (e) {
      showError(e);
    }
  };
  React.useEffect(() => {
    void search(false);
  }, []);
  const { isLoadMore, isLoaded, items, total } = state;
  if (!isLoaded) {
    return <ProfileTabLoader />;
  }
  if (!total) {
    return <div tw="text-center py-12 text-gray-700">No followers</div>;
  }
  return (
    <div className="px-4 py-5 sm:px-6">
      <ul className="-my-5 divide-y divide-gray-200">
        {items.map(item => (
          <FollowerItem
            toggleFollow={toggleFollow}
            follower={item}
            key={item.id}
            loggedUser={user}
          />
        ))}
      </ul>
      {total > items.length && (
        <div className="mt-6">
          <Button
            type="primary"
            tw="px-10"
            loading={isLoadMore}
            onClick={() => {
              void search(true);
            }}
          >
            Load More
          </Button>
        </div>
      )}
    </div>
  );
}
