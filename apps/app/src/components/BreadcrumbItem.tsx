import Link from 'next/link';
import React from 'react';
import tw from 'twin.macro';

interface BreadcrumbItemProps {
  href?: string;
  children: React.ReactNode;
}

export function BreadcrumbItem(props: BreadcrumbItemProps) {
  const { children, href } = props;
  const baseStyle = tw`ml-4 text-sm font-medium text-gray-500 `;
  return (
    <li tw="flex">
      <div tw="flex items-center">
        <svg
          tw="flex-shrink-0 w-6 h-full text-gray-200"
          viewBox="0 0 24 44"
          preserveAspectRatio="none"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
        </svg>
        {href ? (
          <Link href={href}>
            <a
              href={href}
              css={[baseStyle, tw`hover:text-gray-700`]}
              aria-current={!href ? 'page' : undefined}
            >
              {children}
            </a>
          </Link>
        ) : (
          <a css={baseStyle} aria-current={'page'}>
            {children}
          </a>
        )}
      </div>
    </li>
  );
}
