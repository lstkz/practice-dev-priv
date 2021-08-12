import {
  UsersIcon,
  ClockIcon,
  ChartSquareBarIcon,
  ClipboardCheckIcon,
} from '@heroicons/react/outline';
import Link from 'next/link';
import React from 'react';
import { createUrl } from '../../common/url';
import Badge from '../../components/Badge';
import DotBadge from '../../components/DotBadge';
import { IconStats } from '../../components/IconStats';

export interface Challenge {
  id: number;
  title: string;
  description: string;
  tags: string[];
  status: 'solved' | 'attempted' | 'unattempted';
}

interface ChallengeListItemProps {
  item: Challenge;
}

export function ChallengeListItem(props: ChallengeListItemProps) {
  const { item } = props;
  return (
    <li>
      <Link
        passHref
        href={createUrl({ name: 'challenge', id: item.id.toString() })}
      >
        <a tw="block hover:bg-gray-50 focus:( outline-none bg-gray-100 ) ">
          <div tw="px-4 py-4 sm:px-6">
            <div tw="flex items-center justify-between">
              <div>
                <p tw="text-xl font-medium text-gray-800  truncate">
                  {item.title}
                </p>
                <p tw="text-sm mt-2 text-gray-600">{item.description}</p>
              </div>
              <div tw="ml-6">
                <DotBadge
                  color={
                    item.status === 'unattempted'
                      ? 'gray'
                      : item.status === 'attempted'
                      ? 'red'
                      : 'green'
                  }
                />
              </div>
            </div>
            <div tw="mt-4 flex space-x-4">
              <IconStats icon={<UsersIcon />} tooltip="Users attempted">
                250
              </IconStats>
              <IconStats icon={<ClockIcon />} tooltip="Total practice time">
                15m
              </IconStats>
              <IconStats icon={<ChartSquareBarIcon />} tooltip="Success rate">
                94%
              </IconStats>
              <IconStats icon={<ClipboardCheckIcon />} tooltip="Solutions">
                15
              </IconStats>
            </div>
            <div tw="mt-2 space-x-2">
              {item.tags.map(tag => (
                <Badge key={tag} color="purple">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </a>
      </Link>
    </li>
  );
}
