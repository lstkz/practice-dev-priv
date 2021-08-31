import {
  UsersIcon,
  ClockIcon,
  ChartSquareBarIcon,
  ClipboardCheckIcon,
} from '@heroicons/react/outline';
import Link from 'next/link';
import React from 'react';
import { Challenge } from 'shared';
import { doFn, formatTotalTime } from 'src/common/helper';
import { createUrl } from 'src/common/url';
import Badge from '../../components/Badge';
import DotBadge from '../../components/DotBadge';
import { IconStats } from '../../components/IconStats';

interface ChallengeListItemProps {
  item: Challenge;
}

export function ChallengeListItem(props: ChallengeListItemProps) {
  const { item } = props;
  const allTags = [item.difficulty];
  return (
    <li>
      <Link
        passHref
        href={createUrl({
          name: 'challenge',
          slug: item.slug,
        })}
      >
        <a tw="block hover:bg-gray-50 focus:( outline-none bg-gray-100 ) ">
          <div tw="px-4 py-4 sm:px-6">
            <div tw="flex items-center justify-between">
              <div>
                <p tw="text-xl font-medium text-gray-800  truncate">
                  {item.title}
                </p>
                <p
                  tw="text-sm mt-2 text-gray-600"
                  dangerouslySetInnerHTML={{ __html: item.description }}
                />
              </div>
              <div tw="ml-6">
                <DotBadge
                  color={
                    item.isSolved ? 'green' : item.isAttempted ? 'red' : 'gray'
                  }
                />
              </div>
            </div>
            <div tw="mt-4 flex space-x-4">
              <IconStats icon={<UsersIcon />} tooltip="Users attempted">
                {item.stats.uniqueAttempts}
              </IconStats>
              <IconStats icon={<ClockIcon />} tooltip="Total practice time">
                {formatTotalTime(item.practiceTime)}
              </IconStats>
              <IconStats icon={<ChartSquareBarIcon />} tooltip="Success rate">
                {doFn(() => {
                  const { totalSubmissions, passingSubmissions } = item.stats;
                  if (!totalSubmissions) {
                    return '-';
                  }
                  const percent = Math.floor(
                    (passingSubmissions / totalSubmissions) * 100
                  );
                  return percent + '%';
                })}
              </IconStats>
              <IconStats icon={<ClipboardCheckIcon />} tooltip="Solutions">
                {item.stats.solutions}
              </IconStats>
            </div>
            <div tw="mt-2 space-x-2">
              {allTags.map((tag, i) => (
                <Badge key={i} color="purple">
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
