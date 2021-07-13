import React from 'react';
import { Button } from '../../components/Button';

export function ProfileHeader() {
  return (
    <div tw="md:flex md:items-center md:justify-between md:space-x-5">
      <div tw="flex items-center space-x-5">
        <div tw="flex-shrink-0">
          <div tw="relative">
            <img
              tw="h-16 w-16 rounded-full"
              src="https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80"
              alt=""
            />
            <span
              tw="absolute inset-0 shadow-inner rounded-full"
              aria-hidden="true"
            />
          </div>
        </div>
        <div>
          <h1 tw="text-2xl font-bold text-gray-900">Ricardo Cooper</h1>
          <p tw="text-sm font-medium text-gray-500">@user1</p>
        </div>
      </div>
      <div tw="mt-6 md:mt-0">
        <Button type="primary">Follow</Button>
      </div>
    </div>
  );
}
