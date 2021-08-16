import React from 'react';
import { Button } from '../../../components/Button';
import Select from '../../../components/Select';
import { TabLoader } from '../TabLoader';
import { TabTitle } from '../TabTitle';
import { SubmissionSortBy } from 'shared';
import { SubmissionHistoryItem } from './SubmissionHistoryItem';
import { useUser } from 'src/features/AuthModule';
import { useChallengeState } from '../ChallengeModule';
import { useSubmissionLoader } from 'src/hooks/useSubmissionLoader';

export function SubmissionHistoryTab() {
  const user = useUser();
  const { challenge } = useChallengeState();
  const { state, search, updateSort } = useSubmissionLoader({
    baseFilter: {
      challengeId: challenge.id,
      username: user.username,
    },
  });
  const { isLoadMore, isLoaded, items, sortBy, total } = state;

  const title = <TabTitle>Submission History</TabTitle>;
  if (!isLoaded) {
    return <TabLoader>{title}</TabLoader>;
  }
  return (
    <div>
      {title}
      <div style={{ maxWidth: 120 }}>
        <Select
          type="light"
          focusBg="gray-900"
          value={sortBy}
          label={<span tw="text-gray-200">Sort by</span>}
          onChange={updateSort}
          options={[
            {
              label: 'Newest',
              value: SubmissionSortBy.Newest,
            },
            {
              label: 'Oldest',
              value: SubmissionSortBy.Oldest,
            },
          ]}
        />
      </div>
      <div className="flow-root mt-6">
        <ul className="-my-5 divide-y divide-gray-700">
          {items.map(item => (
            <SubmissionHistoryItem key={item.id} item={item} />
          ))}
        </ul>
      </div>
      {total > items.length && (
        <div className="mt-6">
          <Button
            type="light"
            block
            focusBg="gray-900"
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
