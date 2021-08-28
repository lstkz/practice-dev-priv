import { UsersIcon, ClockIcon } from '@heroicons/react/outline';
import Link from 'next/link';
import React from 'react';
import { Module } from 'shared';
import { formatTotalTime } from 'src/common/helper';
import tw from 'twin.macro';
import { createUrl } from '../../common/url';
import Badge from '../../components/Badge';
import { IconStats } from '../../components/IconStats';

interface ModuleListItemProps {
  item: Module;
}

export function ModuleListItem(props: ModuleListItemProps) {
  const { item } = props;
  const { solvedChallenges, totalChallenges, isComingSoon } = item;
  const progress = (solvedChallenges / totalChallenges) * 100;
  const allTags = [item.mainTechnology, ...item.tags, item.difficulty];
  const content = (
    <div tw="px-4 py-4 sm:px-6">
      <div tw="flex items-center justify-between relative">
        <div>
          <p tw="text-xl font-medium text-gray-800  truncate flex items-center">
            {item.title}
            {isComingSoon && (
              <span tw="ml-2 inline-flex items-center px-1 rounded text-xs font-medium bg-yellow-400 text-gray-800">
                Coming soon
              </span>
            )}
          </p>
          <p tw="text-sm mt-2 text-gray-600">{item.description}</p>
        </div>
        {!isComingSoon && (
          <div tw="ml-6">
            <div
              css={[
                tw`inline-flex items-baseline px-2.5 py-0.5 rounded-full text-sm font-medium  md:mt-2 lg:mt-0`,
                progress === 100
                  ? tw`bg-green-100 text-green-800`
                  : progress < 50
                  ? tw`bg-red-100 text-red-800`
                  : tw`bg-yellow-100 text-yellow-800`,
              ]}
            >
              {solvedChallenges}/{totalChallenges}
            </div>
          </div>
        )}
      </div>
      <div tw="mt-4 ">
        {!isComingSoon && (
          <div tw="flex space-x-4">
            <IconStats icon={<UsersIcon />} tooltip="Users attempted">
              {item.stats.enrolledUsers}
            </IconStats>
            <IconStats icon={<ClockIcon />} tooltip="Total practice time">
              {formatTotalTime(item.totalTime)}
            </IconStats>
          </div>
        )}
        <div tw="mt-2 space-x-2">
          {allTags.map((tag, i) => (
            <Badge key={i} color="purple">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
  return (
    <li>
      {isComingSoon ? (
        <div tw="opacity-70">{content}</div>
      ) : (
        <Link passHref href={createUrl({ name: 'module', slug: item.slug })}>
          <a tw="block hover:bg-gray-50 focus:( outline-none bg-gray-100 ) ">
            {content}
          </a>
        </Link>
      )}
    </li>
  );
}
