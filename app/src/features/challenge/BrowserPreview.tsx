import {
  ArrowLeftIcon,
  ArrowRightIcon,
  RefreshIcon,
} from '@heroicons/react/solid';
import React from 'react';
import tw, { styled } from 'twin.macro';

const IconButton = styled.button`
  ${tw`h-6 w-6 text-gray-500 hover:bg-gray-200 p-0.5 rounded-sm hover:cursor-pointer`}
  ${tw`focus:(outline-none ring-1 ring-gray-400) `}
`;

export function BrowserPreview() {
  return (
    <div tw="h-full bg-gray-100">
      <div tw="shadow-md flex p-2 items-center space-x-2">
        <IconButton>
          <ArrowLeftIcon />
        </IconButton>
        <IconButton>
          <ArrowRightIcon />
        </IconButton>
        <IconButton>
          <RefreshIcon />
        </IconButton>
        <input
          css={[
            tw`h-6 rounded-md border-gray-300 flex-1 text-gray-500`,
            tw`focus:( ring-0 outline-none border-gray-400 bg-gray-50 )`,
          ]}
          type="text"
          defaultValue="/"
          onChange={() => {
            //
          }}
        />
      </div>
    </div>
  );
}
