import { UsersIcon, ClockIcon } from '@heroicons/react/outline';
import Link from 'next/link';
import React from 'react';
import tw from 'twin.macro';
import { createUrl } from '../../common/url';
import Badge from '../../components/Badge';

interface Module {
  id: number;
  title: string;
  description: React.ReactNode;
  tags: string[];
  solved: number;
  total: number;
}

interface ModuleListItemProps {
  item: Module;
}

export function ModuleListItem(props: ModuleListItemProps) {
  const { item } = props;
  const { solved, total } = item;
  const progress = (solved / total) * 100;
  return (
    <li key={item.id}>
      <Link passHref href={createUrl({ name: 'module', id: item.id })}>
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
                  {solved}/{total}
                </div>
              </div>
            </div>
            <div tw="mt-4 ">
              <div tw="flex">
                <p tw="flex items-center text-sm text-gray-500">
                  <UsersIcon
                    tw="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                  250
                </p>
                <p tw="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                  <ClockIcon
                    tw="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                  100h
                </p>
              </div>
              <div tw="mt-2 space-x-2">
                {item.tags.map(tag => (
                  <Badge key={tag} color="purple">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </a>
      </Link>
    </li>
  );
}
