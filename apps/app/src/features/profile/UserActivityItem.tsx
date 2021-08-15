import { Activity } from 'shared';
import * as DateFns from 'date-fns';
import { CheckIcon, UserIcon } from '@heroicons/react/solid';
import tw, { styled } from 'twin.macro';
import React from 'react';
import Link from 'next/link';
import { createUrl } from 'src/common/url';

interface UserActivityItemProps {
  item: Activity;
  isLast: boolean;
}

interface ActivityIconProps {
  color: any;
  Icon: any;
}

function ActivityIcon(props: ActivityIconProps) {
  const { Icon, color } = props;

  return (
    <span
      css={[
        color,
        tw`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white`,
      ]}
    >
      <Icon className="w-5 h-5 text-white" aria-hidden="true" />
    </span>
  );
}

const TextWrapper = styled.p`
  ${tw`text-sm text-gray-500`}
  a {
    ${tw`font-medium text-gray-900`}
    &:hover {
      text-decoration: underline;
    }
  }
`;

export function UserActivityItem(props: UserActivityItemProps) {
  const { item, isLast } = props;

  const renderIcon = () => {
    switch (item.type) {
      case 'registered': {
        return <ActivityIcon Icon={UserIcon} color={tw`bg-gray-400`} />;
      }
      case 'challenge-solved': {
        return <ActivityIcon Icon={CheckIcon} color={tw`bg-green-500`} />;
      }
    }
  };

  const renderContent = () => {
    switch (item.type) {
      case 'registered': {
        return 'User registered';
      }
      case 'challenge-solved': {
        const { challenge, module } = item.values;
        return (
          <>
            Solved a challenge{' '}
            <Link href={createUrl({ name: 'challenge', id: challenge.id })}>
              <a>{challenge.title}</a>
            </Link>
            {' in '}
            <Link href={createUrl({ name: 'module', id: module.id })}>
              <a>{module.title}</a>
            </Link>
          </>
        );
      }
    }
  };
  const renderDate = () => {
    const date = new Date(item.values.createdAt);
    if (DateFns.isSameYear(date, new Date())) {
      return DateFns.format(date, 'MMM dd');
    }
    return DateFns.format(date, 'dd/MM/yyyy');
  };
  return (
    <li>
      <div tw="relative pb-8">
        {!isLast && (
          <span
            tw="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
            aria-hidden="true"
          />
        )}
        <div tw="relative flex space-x-3">
          <div>{renderIcon()}</div>
          <div tw="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
            <div>
              <TextWrapper>{renderContent()}</TextWrapper>
            </div>
            <div tw="text-right text-sm whitespace-nowrap text-gray-500">
              <time dateTime={item.values.createdAt}>{renderDate()}</time>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}
