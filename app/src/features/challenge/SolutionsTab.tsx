import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/solid';
import React from 'react';
import tw, { styled } from 'twin.macro';
import { Button, getBaseButtonStyles } from '../../components/Button';
import Select from '../../components/Select';
import SolutionButton from './SolutionOptions';
import SolutionOptions from './SolutionOptions';
import { TabTitle } from './TabTitle';

interface Solution {
  name: string;
  handle: string;
  imageUrl: string;
  voted?: 'up' | 'down';
}

const solutions: Solution[] = [
  {
    name: 'My solution',
    handle: 'leonardkrasner',
    imageUrl:
      'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    voted: 'up',
  },
  {
    name: 'My solution',
    handle: 'floydmiles',
    imageUrl:
      'https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    voted: 'down',
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

interface IconButtonProps {
  state?: 'red' | 'green';
}

const IconButton = styled.button<IconButtonProps>`
  ${getBaseButtonStyles({
    type: 'light',
    focusBg: 'gray-900',
  })}
  ${props => props.state === 'red' && tw`bg-red-400 hover:bg-red-500`}
  ${props => props.state === 'green' && tw`bg-green-400 hover:bg-green-500`}
  ${tw`h-5 w-6 p-0 rounded-sm`}
`;

export function SolutionsTab() {
  const [sortBy, setSortBy] = React.useState('best');
  const [isLoaded, setIsLoaded] = React.useState(false);
  React.useEffect(() => {
    setTimeout(() => {
      setIsLoaded(true);
    }, 1000);
  }, []);
  const title = <TabTitle>Solutions</TabTitle>;
  if (!isLoaded) {
    return (
      <div tw="h-full">
        {title}
        <div tw="flex h-3/4 items-center justify-center">
          <FontAwesomeIcon
            tw="text-indigo-300 text-5xl animate-spin-slow "
            icon={faSpinner}
          />
        </div>
      </div>
    );
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
          {solutions.map((item, i) => (
            <li key={i} className="py-4">
              <div className="flex items-center space-x-4">
                <div tw="flex flex-col ml-2">
                  <IconButton state={item.voted === 'up' ? 'green' : undefined}>
                    <ChevronUpIcon />
                  </IconButton>
                  <span tw="text-base text-center font-bold text-indigo-200 py-1">
                    10
                  </span>
                  <IconButton state={item.voted === 'down' ? 'red' : undefined}>
                    <ChevronDownIcon />
                  </IconButton>
                </div>
                <div className="flex-shrink-0">
                  <img
                    className="h-8 w-8 rounded-full"
                    src={item.imageUrl}
                    alt=""
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-medium text-gray-200 truncate">
                    {item.name}
                  </p>
                  <p className="text-sm text-gray-400 whitespace-nowrap truncate">
                    by {'@' + item.handle}
                  </p>
                  <p className="text-sm text-gray-400 truncate">
                    18:00 3/7/2020
                  </p>
                </div>
                <div tw="flex items-center">
                  <SolutionButton />
                  {/* <Button type="light" size="small" focusBg="gray-900">
                    Load
                  </Button>
                  <SolutionOptions /> */}
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
