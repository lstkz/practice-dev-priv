import Link from 'next/link';
import React from 'react';
import { createUrl } from '../../common/url';
import { Button } from '../../components/Button';

interface Follower {
  name: string;
  username: string;
  imageUrl: string;
}

const followers: Follower[] = [
  {
    name: 'Ricardo Cooper',
    username: 'user1',
    imageUrl:
      'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    name: 'Ricardo Cooper',
    username: 'user2',
    imageUrl:
      'https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    name: 'Ricardo Cooper',
    username: 'user3',
    imageUrl:
      'https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    name: 'Ricardo Cooper',
    username: 'user4',
    imageUrl:
      'https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    name: 'Ricardo Cooper',
    username: 'user5',
    imageUrl:
      'https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
];

export function FollowersTab() {
  return (
    <div className="px-4 py-5 sm:px-6">
      <ul className="-my-5 divide-y divide-gray-200">
        {followers.map((item, i) => (
          <li key={i} className="py-4">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <img
                  className="h-8 w-8 rounded-full"
                  src={item.imageUrl}
                  alt=""
                />
              </div>
              <div className="flex-1 min-w-0">
                <Link passHref href={createUrl({ name: 'challenge', id: 1 })}>
                  <a tw="text-gray-800 font-semibold">{item.name}</a>
                </Link>
                <p className="text-sm font-medium text-gray-500 truncate leading-snug">
                  @{item.username}
                </p>
              </div>
              <div tw="flex items-center">
                <Button type="primary">Follow</Button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-6 text-center">
        <Button type="primary" tw="px-10">
          Load More
        </Button>
      </div>
    </div>
  );
}
