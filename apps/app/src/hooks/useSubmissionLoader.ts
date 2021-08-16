import { useImmer } from 'context-api';
import React from 'react';
import { Submission, SubmissionSortBy } from 'shared';
import { useErrorModalActions } from 'src/features/ErrorModalModule';
import { api } from 'src/services/api';

interface State {
  isLoaded: boolean;
  isLoadMore: boolean;
  total: number;
  items: Submission[];
  sortBy: SubmissionSortBy;
}

interface UseSubmissionLoaderOptions {
  baseFilter: {
    challengeId?: string;
    username?: string;
  };
}

export function useSubmissionLoader(options: UseSubmissionLoaderOptions) {
  const { baseFilter } = options;
  const [state, setState, getState] = useImmer<State>(
    {
      isLoaded: false,
      isLoadMore: false,
      total: 0,
      items: [],
      sortBy: SubmissionSortBy.Newest,
    },
    'Submissions'
  );

  const { showError } = useErrorModalActions();
  const search = async (loadMore?: boolean) => {
    try {
      const { items, total } = await api.submission_searchSubmissions({
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
  const updateSort = (sortBy: SubmissionSortBy) => {
    setState(draft => {
      draft.sortBy = sortBy;
    });
    void search();
  };
  React.useEffect(() => {
    void search(false);
  }, []);
  return {
    state,
    search,
    updateSort,
  };
}
