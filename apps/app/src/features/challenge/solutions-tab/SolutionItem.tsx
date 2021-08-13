import React from 'react';
import { Solution } from 'shared';
import * as DateFns from 'date-fns';
import { createUrl } from '../../../common/url';
import { SolutionOptions } from './SolutionOptions';
import Link from 'next/link';
import { UserAvatar } from 'src/components/UserAvatar';
import { VoteSolutionControls } from 'src/components/VoteSolutionControls';

export interface SolutionItemProps {
  readOnly?: boolean;
  item: Solution;
  deleteSolution: () => void;
  updateSolution: () => void;
}

export function SolutionItem(props: SolutionItemProps) {
  const { item, readOnly } = props;

  return (
    <li className="py-4">
      <div className="flex items-center space-x-4">
        <VoteSolutionControls solution={item} readOnly={readOnly} />
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
        {!readOnly && (
          <div tw="flex items-center">
            <SolutionOptions {...props} />
          </div>
        )}
      </div>
    </li>
  );
}
