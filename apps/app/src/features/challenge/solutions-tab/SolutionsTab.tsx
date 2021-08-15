import React from 'react';
import { SolutionSortBy } from 'shared';
import { api } from 'src/services/api';
import { Button } from '../../../components/Button';
import Select from '../../../components/Select';
import { useConfirmModalActions } from '../../ConfirmModalModule';
import { useChallengeState } from '../ChallengeModule';
import { SolutionEditModal, SolutionModalRef } from './SolutionEditModal';
import { SolutionItem } from './SolutionItem';
import { TabLoader } from '../TabLoader';
import { TabTitle } from '../TabTitle';
import { useSubAction } from 'src/features/PubSubContextModule';
import { useUser } from 'src/features/AuthModule';
import { useSolutionLoader } from 'src/hooks/useSolutionLoader';

export function SolutionsTab() {
  const { challenge } = useChallengeState();
  const {
    state: { isLoadMore, isLoaded, items, sortBy, total },
    search,
    updateSort,
    updateSolutionVote,
    deleteSolution,
    updateSolution,
  } = useSolutionLoader({
    baseFilter: {
      challengeId: challenge.id,
    },
  });
  const user = useUser();
  const { showConfirm } = useConfirmModalActions();
  const solutionEditModalRef = React.useRef<SolutionModalRef>(null!);

  const title = <TabTitle>Solutions</TabTitle>;
  useSubAction({
    action: 'solution-vote-stats-updated',
    fn: ({ solutionId, result }) => {
      updateSolutionVote(solutionId, result);
    },
  });
  if (!isLoaded) {
    return <TabLoader>{title}</TabLoader>;
  }

  return (
    <div>
      <SolutionEditModal ref={solutionEditModalRef} />
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
      <div tw="flow-root mt-6">
        {items.length === 0 && (
          <div tw="text-white text-center">No solutions yet</div>
        )}
        <ul tw="-my-5 divide-y divide-gray-700">
          {items.map(item => (
            <SolutionItem
              readOnly={!user}
              deleteSolution={() => {
                showConfirm(
                  {
                    title: 'Delete Solution',
                    children: (
                      <>Are you sure you want to delete this solution?</>
                    ),
                    yesContent: 'Delete',
                  },
                  async () => {
                    await api.solution_deleteSolution(item.id);
                    deleteSolution(item);
                  }
                );
              }}
              updateSolution={() => {
                solutionEditModalRef.current.open(item, updateSolution);
              }}
              item={item}
              key={item.id}
            />
          ))}
        </ul>
      </div>
      {total > items.length && (
        <div tw="mt-6">
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
