import { useImmer } from 'context-api';
import React from 'react';
import { Solution, SolutionSortBy, VoteResult } from 'shared';
import { safeAssign } from 'src/common/helper';
import { useErrorModalActions } from 'src/features/ErrorModalModule';
import { api } from 'src/services/api';

interface UseSolutionLoaderOptions {
  baseFilter: {
    challengeId?: string;
    username?: string;
  };
}

interface State {
  isLoaded: boolean;
  isLoadMore: boolean;
  total: number;
  items: Solution[];
  sortBy: SolutionSortBy;
}

export function useSolutionLoader(options: UseSolutionLoaderOptions) {
  const [state, setState, getState] = useImmer<State>(
    {
      isLoaded: false,
      isLoadMore: false,
      total: 0,
      items: [],
      sortBy: SolutionSortBy.Best,
    },
    'SolutionsTab'
  );
  const { baseFilter } = options;
  const { showError } = useErrorModalActions();
  const search = async (loadMore?: boolean) => {
    try {
      const { items, total } = await api.solution_searchSolutions({
        offset: loadMore ? getState().items.length : 0,
        limit: 20,
        sortBy: getState().sortBy,
        ...baseFilter,
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
  const updateSolutionVote = (solutionId: string, result: VoteResult) => {
    setState(draft => {
      draft.items.forEach(item => {
        if (item.id === solutionId) {
          safeAssign(item, result);
        }
      });
    });
  };
  const updateSort = (sortBy: SolutionSortBy) => {
    setState(draft => {
      draft.sortBy = sortBy;
    });
    void search();
  };
  const deleteSolution = async (item: Solution) => {
    setState(draft => {
      draft.items = draft.items.filter(x => x.id !== item.id);
      draft.total--;
    });
  };
  const updateSolution = async (item: Solution) => {
    setState(draft => {
      draft.items = draft.items.map(current => {
        if (current.id === item.id) {
          return item;
        }
        return current;
      });
    });
  };
  React.useEffect(() => {
    void search(false);
  }, []);
  return {
    updateSort,
    search,
    state,
    updateSolutionVote,
    deleteSolution,
    updateSolution,
  };
}
