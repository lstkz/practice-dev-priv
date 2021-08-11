import { useImmer } from 'context-api';
import React from 'react';
import { Solution, SolutionSortBy } from 'shared';
import { api } from 'src/services/api';
import { Button } from '../../components/Button';
import Select from '../../components/Select';
import { useConfirmModalActions } from '../ConfirmModalModule';
import { useErrorModalActions } from '../ErrorModalModule';
import { useChallengeState } from './ChallengeModule';
import { SolutionEditModal, SolutionModalRef } from './SolutionEditModal';
import { SolutionItem } from './SolutionItem';
import { TabLoader } from './TabLoader';
import { TabTitle } from './TabTitle';

interface State {
  isLoaded: boolean;
  isLoadMore: boolean;
  total: number;
  items: Solution[];
  sortBy: SolutionSortBy;
}

export function SolutionsTab() {
  const [state, setState, getState] = useImmer<State>(
    {
      isLoaded: false,
      isLoadMore: false,
      total: 0,
      items: [],
      sortBy: SolutionSortBy.Best,
    },
    'SubmissionHistoryTab'
  );
  const { isLoadMore, isLoaded, items, sortBy, total } = state;
  const { showError } = useErrorModalActions();
  const { challenge } = useChallengeState();
  const searchData = async (loadMore?: boolean) => {
    try {
      const { items, total } = await api.solution_searchSolutions({
        offset: loadMore ? getState().items.length : 0,
        limit: 20,
        sortBy: getState().sortBy,
        challengeId: challenge.id,
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

  React.useEffect(() => {
    void searchData(false);
  }, []);
  const { showConfirm } = useConfirmModalActions();
  const solutionEditModalRef = React.useRef<SolutionModalRef>(null!);

  const title = <TabTitle>Solutions</TabTitle>;
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
          onChange={value => {
            setState(draft => {
              draft.sortBy = value;
            });
            void searchData();
          }}
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
                    setState(draft => {
                      draft.items = draft.items.filter(x => x.id !== item.id);
                      draft.total--;
                    });
                  }
                );
              }}
              updateSolution={() => {
                solutionEditModalRef.current.open(item, item => {
                  setState(draft => {
                    draft.items = draft.items.map(current => {
                      if (current.id === item.id) {
                        return item;
                      }
                      return current;
                    });
                  });
                });
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
              void searchData(true);
            }}
          >
            Load More
          </Button>
        </div>
      )}
    </div>
  );
}
