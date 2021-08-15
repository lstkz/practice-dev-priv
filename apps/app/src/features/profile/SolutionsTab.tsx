import Link from 'next/link';
import React from 'react';
import * as DateFns from 'date-fns';
import { SolutionSortBy } from 'shared/src/types';
import { useSolutionLoader } from 'src/hooks/useSolutionLoader';
import { createUrl } from '../../common/url';
import { Button } from '../../components/Button';
import Select from '../../components/Select';
import { useProfileState } from './ProfileModule';
import { UserAvatar } from 'src/components/UserAvatar';
import { ProfileTabLoader } from './ProfileTabLoader';

export function SolutionsTab() {
  const { profile } = useProfileState();
  const {
    state: { isLoadMore, isLoaded, items, sortBy, total },
    search,
    updateSort,
  } = useSolutionLoader({
    baseFilter: {
      username: profile.username,
    },
  });

  if (!isLoaded) {
    return <ProfileTabLoader />;
  }

  return (
    <div className="px-4 py-5 sm:px-6">
      <div style={{ maxWidth: 120 }}>
        <Select
          type="white"
          value={sortBy}
          label={<span>Sort by</span>}
          onChange={updateSort}
          options={[
            {
              label: 'Best',
              value: SolutionSortBy.Best,
            },
            {
              label: 'Newest',
              value: SolutionSortBy.Newest,
            },
            {
              label: 'Oldest',
              value: SolutionSortBy.Oldest,
            },
          ]}
        />
      </div>
      <div className="flow-root mt-6">
        <ul className="-my-5 divide-y divide-gray-200">
          {items.map((item, i) => (
            <li key={i} className="py-4">
              <div className="flex items-center space-x-4">
                <div tw="flex flex-col ml-2">
                  <span tw="text-base text-center font-bold text-gray-700 py-1">
                    {item.score}
                  </span>
                </div>
                <div className="flex-shrink-0">
                  <UserAvatar size="md" user={item.author} />
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    passHref
                    href={createUrl({
                      name: 'challenge',
                      id: item.challenge.id,
                    })}
                  >
                    <a tw="text-gray-800 font-semibold">
                      {item.challenge.title}
                    </a>
                  </Link>
                  <p className="text-sm font-medium text-gray-500 truncate leading-snug">
                    {item.title}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {DateFns.format(
                      new Date(item.createdAt),
                      'HH:mm dd/MM/yyyy'
                    )}
                  </p>
                </div>
                <div tw="flex items-center">
                  <Button
                    type="white"
                    href={createUrl({
                      name: 'challenge',
                      id: item.challenge.id,
                      solutionId: item.id,
                    })}
                  >
                    Show
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
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
