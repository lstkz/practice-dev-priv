import Link from 'next/link';
import React from 'react';
import * as DateFns from 'date-fns';
import { useSubmissionLoader } from 'src/hooks/useSubmissionLoader';
import { createUrl } from '../../common/url';
import { Button } from '../../components/Button';
import Select from '../../components/Select';
import { useProfileState } from './ProfileModule';
import { ProfileTabLoader } from './ProfileTabLoader';
import { SubmissionStatusBadge } from 'src/components/SubmissionStatusBadge';

export function SubmissionsTab() {
  const { profile } = useProfileState();
  const {
    state: { isLoadMore, isLoaded, items, sortBy, total },
    search,
    updateSort,
  } = useSubmissionLoader({
    baseFilter: {
      username: profile.username,
    },
  });
  if (!isLoaded) {
    return <ProfileTabLoader />;
  }
  if (!total) {
    return <div tw="text-center py-12 text-gray-700">No submissions</div>;
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
              label: 'Newest',
              value: 'newest',
            },
            {
              label: 'Oldest',
              value: 'oldest',
            },
          ]}
        />
      </div>
      <div className="flow-root mt-6">
        <ul className="-my-5 divide-y divide-gray-200">
          {items.map((item, i) => (
            <li key={i} className="py-4">
              <div className="flex items-center space-x-4">
                <SubmissionStatusBadge status={item.status} />
                <div className="flex-1 min-w-0">
                  <Link
                    passHref
                    href={createUrl({
                      name: 'challenge',
                      slug: item.challenge.slug,
                    })}
                  >
                    <a tw="text-gray-800 font-semibold">
                      {item.challenge.title}
                    </a>
                  </Link>
                  <p className="text-sm text-gray-500 truncate">
                    {DateFns.format(
                      new Date(item.createdAt),
                      'HH:mm dd/MM/yyyy'
                    )}
                  </p>
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
