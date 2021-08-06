import React from 'react';
import * as DateFns from 'date-fns';
import Badge from '../../components/Badge';
import { Button } from '../../components/Button';
import Select from '../../components/Select';
import { TabLoader } from './TabLoader';
import { TabTitle } from './TabTitle';
import { useImmer } from 'context-api';
import { useErrorModalActions } from '../ErrorModalModule';
import { Submission, SubmissionSortBy, SubmissionStatus } from 'shared';
import { api } from 'src/services/api';

interface State {
  isLoaded: boolean;
  isLoadMore: boolean;
  total: number;
  items: Submission[];
  sortBy: SubmissionSortBy;
}

export function SubmissionHistoryTab() {
  const [state, setState, getState] = useImmer<State>(
    {
      isLoaded: false,
      isLoadMore: false,
      total: 0,
      items: [],
      sortBy: SubmissionSortBy.Newest,
    },
    'SubmissionHistoryTab'
  );
  const { isLoadMore, isLoaded, items, sortBy, total } = state;
  const { showError } = useErrorModalActions();

  const searchData = async (loadMore?: boolean) => {
    try {
      const { items, total } = await api.submission_searchSubmissions({
        offset: loadMore ? getState().items.length : 0,
        limit: 20,
        sortBy: getState().sortBy,
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
          onChange={value => {
            setState(draft => {
              draft.sortBy = value;
            });
            void searchData();
          }}
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
          {items.map((item, i) => (
            <li key={i} className="py-4">
              <div className="flex items-center space-x-4">
                <Badge
                  dark
                  color={
                    item.status === SubmissionStatus.Fail
                      ? 'red'
                      : item.status === SubmissionStatus.Pass
                      ? 'green'
                      : 'gray'
                  }
                >
                  {item.status.toUpperCase()}
                </Badge>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-400 truncate">
                    {DateFns.format(
                      new Date(item.createdAt),
                      'HH:mm dd/MM/yyyy'
                    )}
                  </p>
                </div>
                <div tw="flex items-center">
                  <Button type="light" size="small" focusBg="gray-900">
                    Load
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
