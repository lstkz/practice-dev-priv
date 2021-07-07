import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/outline';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/solid';
import React from 'react';
import tw, { styled } from 'twin.macro';
import { Button } from '../../components/Button';
import Select from '../../components/Select';

const people = [
  {
    name: 'My solution',
    handle: 'leonardkrasner',
    imageUrl:
      'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    name: 'My solution',
    handle: 'floydmiles',
    imageUrl:
      'https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    name: 'My solution',
    handle: 'emilyselman',
    imageUrl:
      'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    name: 'My solution',
    handle: 'kristinwatson',
    imageUrl:
      'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    name: 'My solution',
    handle: 'leonardkrasner',
    imageUrl:
      'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    name: 'My solution',
    handle: 'emilyselman',
    imageUrl:
      'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
];

const IconButton = styled.button`
  ${tw`h-5 w-6  bg-indigo-300 hover:bg-indigo-400 p-0.5 rounded-sm hover:cursor-pointer flex items-center justify-center text-black`}
  ${tw`focus:(outline-none ring-2 ring-indigo-500 ring-offset-2 ring-offset-gray-900) `}
`;

export function SolutionsTab() {
  const [sortBy, setSortBy] = React.useState('best');

  return (
    <div>
      <div style={{ maxWidth: 120 }}>
        <Select
          type="light"
          focusBg="gray-900"
          value={sortBy}
          label={<span tw="text-gray-200">Sort by</span>}
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
        <ul className="-my-5 divide-y divide-gray-700">
          {people.map((person, i) => (
            <li key={i} className="py-4">
              <div className="flex items-center space-x-4">
                <div tw="flex flex-col ml-2">
                  <IconButton>
                    <ChevronUpIcon />
                  </IconButton>
                  <span tw="text-base text-center font-bold text-indigo-200 py-1">
                    10
                  </span>
                  <IconButton>
                    <ChevronDownIcon />
                  </IconButton>
                </div>
                <div className="flex-shrink-0">
                  <img
                    className="h-8 w-8 rounded-full"
                    src={person.imageUrl}
                    alt=""
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-medium text-gray-200 truncate">
                    {person.name}
                  </p>
                  <p className="text-sm text-gray-400 ">
                    by {'@' + person.handle}
                  </p>
                  <p className="text-sm text-gray-400 ">at 18:00 3 Jul 2020</p>
                </div>
                <div>
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
