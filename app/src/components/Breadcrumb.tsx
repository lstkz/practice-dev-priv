import { HomeIcon } from '@heroicons/react/solid';
import Link from 'next/link';
import React from 'react';
import { createUrl } from '../common/url';

interface BreadcrumbProps {
  children: React.ReactNode;
}

export default function Breadcrumb(props: BreadcrumbProps) {
  const { children } = props;
  return (
    <nav
      className="bg-white border-b border-gray-200 flex"
      aria-label="Breadcrumb"
    >
      <ol className="max-w-screen-xl w-full mx-auto px-4 flex space-x-4 sm:px-6 lg:px-8">
        <li className="flex">
          <div className="flex items-center">
            <Link href={createUrl({ name: 'modules' })}>
              <a className="text-gray-400 hover:text-gray-500">
                <HomeIcon
                  className="flex-shrink-0 h-5 w-5"
                  aria-hidden="true"
                />
                <span className="sr-only">Home</span>
              </a>
            </Link>
          </div>
        </li>
        {children}
      </ol>
    </nav>
  );
}
