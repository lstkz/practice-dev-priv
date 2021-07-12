import React from 'react';
import Badge from '../../components/Badge';
import { Button } from '../../components/Button';
import Select from '../../components/Select';
import { TabLoader } from './TabLoader';
import { TabTitle } from './TabTitle';

interface Submission {
  id: string;
  date: string;
  result: 'PASS' | 'FAIL' | 'PENDING';
}

const submissions: Submission[] = [
  {
    id: '1',
    date: '18:00 3/7/2020',
    result: 'PENDING',
  },
  {
    id: '2',
    date: '18:00 3/7/2020',
    result: 'PASS',
  },
  {
    id: '3',
    date: '18:00 3/7/2020',
    result: 'FAIL',
  },
  {
    id: '4',
    date: '18:00 3/7/2020',
    result: 'FAIL',
  },
  {
    id: '5',
    date: '18:00 3/7/2020',
    result: 'FAIL',
  },
];

export function SubmissionHistoryTab() {
  const [sortBy, setSortBy] = React.useState('newest');
  const [isLoaded, setIsLoaded] = React.useState(false);
  React.useEffect(() => {
    setTimeout(() => {
      setIsLoaded(true);
    }, 1000);
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
          onChange={setSortBy}
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
        <ul className="-my-5 divide-y divide-gray-700">
          {submissions.map((item, i) => (
            <li key={i} className="py-4">
              <div className="flex items-center space-x-4">
                <Badge
                  dark
                  color={
                    item.result === 'FAIL'
                      ? 'red'
                      : item.result === 'PASS'
                      ? 'green'
                      : 'gray'
                  }
                >
                  {item.result}
                </Badge>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-400 truncate">
                    18:00 3/7/2020
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
      <div className="mt-6">
        <Button type="light" block focusBg="gray-900">
          Load More
        </Button>
      </div>
    </div>
  );
}
