import React from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/solid';
import { Solution } from 'shared';
import tw, { styled } from 'twin.macro';
import * as DateFns from 'date-fns';
import { createUrl } from '../../../common/url';
import { SolutionOptions } from './SolutionOptions';
import { getBaseButtonStyles } from '../../../components/Button';
import Link from 'next/link';
import { UserAvatar } from 'src/components/UserAvatar';

export interface SolutionItemProps {
  item: Solution;
  deleteSolution: () => void;
  updateSolution: () => void;
}

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

export function SolutionItem(props: SolutionItemProps) {
  const { item } = props;
  return (
    <li className="py-4">
      <div className="flex items-center space-x-4">
        <div tw="flex flex-col ml-2">
          <IconButton state={undefined}>
            <ChevronUpIcon />
          </IconButton>
          <span tw="text-base text-center font-bold text-indigo-200 py-1">
            {item.score}
          </span>
          <IconButton state={undefined}>
            <ChevronDownIcon />
          </IconButton>
        </div>
        <div className="flex-shrink-0">
          <UserAvatar size="md" user={item.author} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-base font-medium text-gray-200 truncate">
            {item.title}
          </p>
          <p className="text-sm text-gray-400 whitespace-nowrap truncate">
            by{' '}
            <Link
              passHref
              href={createUrl({
                name: 'profile',
                username: item.author.username,
              })}
            >
              <a>{'@' + item.author.username}</a>
            </Link>
          </p>
          <p className="text-sm text-gray-400 truncate">
            {DateFns.format(new Date(item.createdAt), 'HH:mm dd/MM/yyyy')}
          </p>
        </div>
        <div tw="flex items-center">
          <SolutionOptions {...props} />
        </div>
      </div>
    </li>
  );
}
