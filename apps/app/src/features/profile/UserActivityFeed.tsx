import React from 'react';
import { Button } from 'src/components/Button';
import { useProfileActions, useProfileState } from './ProfileModule';
import { UserActivityItem } from './UserActivityItem';

export function UserActivityFeed() {
  const {
    activity: { isLoadMore, items, total },
  } = useProfileState();
  const { loadMoreActivity } = useProfileActions();
  return (
    <section aria-labelledby="timeline-title" tw="lg:col-start-3 lg:col-span-1">
      <div tw="bg-white px-4 py-5 shadow sm:rounded-lg sm:px-6">
        <h2 id="timeline-title" tw="text-lg font-medium text-gray-900">
          Activity
        </h2>
        <div tw="mt-6 flow-root">
          <ul tw="-mb-8">
            {items.map((item, i) => (
              <UserActivityItem
                isLast={items.length - 1 === i}
                key={i}
                item={item}
              />
            ))}
          </ul>
        </div>
        {total > items.length && (
          <div tw="mt-6">
            <Button
              type="primary"
              loading={isLoadMore}
              block
              onClick={loadMoreActivity}
            >
              Load more
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
