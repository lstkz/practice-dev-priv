import React from 'react';
import { SpeakerphoneIcon } from '@heroicons/react/outline';
import { CRYPTO_LINK } from 'src/config';

export function CryptoBanner() {
  return (
    <div className="bg-indigo-600 fixed top-0 z-20 left-0 right-0">
      <div className="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between flex-wrap">
          <div className="w-0 flex-1 flex items-center">
            <span className="flex p-2 rounded-lg bg-indigo-800">
              <SpeakerphoneIcon
                className="h-6 w-6 text-white"
                aria-hidden="true"
              />
            </span>
            <p className="ml-3 font-medium text-white truncate">
              <span>Token sale is Live</span>
            </p>
          </div>
          <a
            href={CRYPTO_LINK}
            target="_blank"
            rel="nofollow"
            className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-indigo-50"
          >
            Buy $DEVC on Uniswap
          </a>
        </div>
      </div>
    </div>
  );
}
