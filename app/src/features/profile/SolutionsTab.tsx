import Link from 'next/link';
import React from 'react';
import { createUrl } from '../../common/url';
import { Button } from '../../components/Button';
import Select from '../../components/Select';

interface Solution {
  challenge: string;
  name: string;
  imageUrl: string;
}

const solutions: Solution[] = [
  {
    challenge: 'Simple Counter',
    name: 'My solution',
    imageUrl:
      'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    challenge: 'Simple Counter',
    name: 'My solution',
    imageUrl:
      'https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    challenge: 'Simple Counter',
    name: 'My solution',
    imageUrl:
      'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    challenge: 'Simple Counter',
    name: 'My solution',
    imageUrl:
      'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    challenge: 'Simple Counter',
    name: 'My solution',
    imageUrl:
      'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    challenge: 'Simple Counter',
    name: 'My solution',
    imageUrl:
      'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
];

export function SolutionsTab() {
  const [sortBy, setSortBy] = React.useState('best');

  return (
    <div className=" px-4 py-5 sm:px-6">
      <div style={{ maxWidth: 120 }}>
        <Select
          type="white"
          value={sortBy}
          label={<span>Sort by</span>}
          onChange={setSortBy}
          options={[
            {
              label: 'Best',
              value: 'best',
            },
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
          {solutions.map((item, i) => (
            <li key={i} className="py-4">
              <div className="flex items-center space-x-4">
                <div tw="flex flex-col ml-2">
                  <span tw="text-base text-center font-bold text-indigo-700 py-1">
                    10
                  </span>
                </div>
                <div className="flex-shrink-0">
                  <img
                    className="h-8 w-8 rounded-full"
                    src={item.imageUrl}
                    alt=""
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <Link passHref href={createUrl({ name: 'challenge', id: 1 })}>
                    <a tw="text-indigo-700 font-semibold">{item.challenge}</a>
                  </Link>
                  <p className="text-base font-medium text-gray-800 truncate">
                    {item.name}
                  </p>
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
      <div className="mt-6">
        <Button type="primary" block>
          Load More
        </Button>
      </div>
    </div>
  );
}
