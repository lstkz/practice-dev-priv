import Link from 'next/link';
import React from 'react';
import { createUrl } from '../../common/url';
import Badge from '../../components/Badge';
import { Button } from '../../components/Button';
import Select from '../../components/Select';

interface Submission {
  id: string;
  challenge: string;
  date: string;
  result: 'PASS' | 'FAIL' | 'PENDING';
}

const submissions: Submission[] = [
  {
    id: '1',
    challenge: 'Simple Counter',
    date: '18:00 3/7/2020',
    result: 'PENDING',
  },
  {
    id: '2',
    challenge: 'Simple Counter',
    date: '18:00 3/7/2020',
    result: 'PASS',
  },
  {
    id: '3',
    challenge: 'Simple Counter',
    date: '18:00 3/7/2020',
    result: 'FAIL',
  },
  {
    id: '4',
    challenge: 'Simple Counter',
    date: '18:00 3/7/2020',
    result: 'FAIL',
  },
  {
    id: '5',
    challenge: 'Simple Counter',
    date: '18:00 3/7/2020',
    result: 'FAIL',
  },
];

export function SubmissionsTab() {
  const [sortBy, setSortBy] = React.useState('newest');

  return (
    <div className="px-4 py-5 sm:px-6">
      <div style={{ maxWidth: 120 }}>
        <Select
          type="white"
          value={sortBy}
          label={<span>Sort by</span>}
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
        <ul className="-my-5 divide-y divide-gray-200">
          {submissions.map((item, i) => (
            <li key={i} className="py-4">
              <div className="flex items-center space-x-4">
                <Badge
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
                  <Link passHref href={createUrl({ name: 'challenge', id: 1 })}>
                    <a tw="text-gray-700 font-semibold">{item.challenge}</a>
                  </Link>
                  <p className="text-sm text-gray-500 truncate">
                    18:00 3/7/2020
                  </p>
                </div>
                <div tw="flex items-center">
                  <Button type="white">Show</Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-6 text-center">
        <Button type="primary" tw="px-10">
          Load More
        </Button>
      </div>
    </div>
  );
}
