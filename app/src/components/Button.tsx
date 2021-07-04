import Link from 'next/link';
import React from 'react';
import tw from 'twin.macro';
import { SpinnerBoarder } from './SpinnerBoarder';

interface ButtonProps {
  children?: React.ReactNode;
  className?: string;
  type: 'primary' | 'dark' | 'white';
  htmlType?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  block?: boolean;
  icon?: React.ReactNode;
  loading?: boolean;
  href?: string;
  size?: 'small' | 'default' | 'large';
  onClick?: (
    e: React.MouseEvent<HTMLAnchorElement | HTMLDivElement, MouseEvent>
  ) => void;
  testId?: string;
  focusBg?: 'gray-800';
}

export const Button = React.forwardRef((props: ButtonProps, ref: any) => {
  const {
    htmlType,
    type,
    block,
    loading,
    icon,
    children,
    disabled,
    size,
    testId,
    href,
    onClick,
    className,
    focusBg,
  } = props;
  const inner = (
    <>
      {(loading || icon) && (
        <div className="mr-3 flex items-center">
          {loading ? <SpinnerBoarder size="sm" /> : icon}
        </div>
      )}
      {children}
    </>
  );
  const isDisabled = loading || disabled;
  const css = [
    tw`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md justify-center`,
    tw`focus:( outline-none ring-2 ring-offset-2 )`,
    block && tw`w-full`,
    isDisabled && tw`hover:cursor-default`,
    type === 'dark' && [
      tw`text-white bg-gray-600`,
      tw`hover:( bg-gray-700 )`,
      tw`focus:( ring-gray-700 ring-offset-gray-400 )`,
    ],
    type === 'primary' && [
      tw`text-white bg-indigo-600 `,
      tw`hover:( bg-indigo-700 )`,
      tw`focus:( ring-indigo-500 )`,
      isDisabled && tw`bg-indigo-400!`,
    ],
    type === 'white' && [
      tw`text-gray-700 bg-white border border-gray-300`,
      tw`hover:( bg-gray-50 )`,
      tw`focus:( ring-indigo-500   )`,
    ],
    size === 'small' && tw`text-sm px-2 py-1 rounded`,
    size === 'large' && tw`px-5 py-3 text-base`,
    focusBg === 'gray-800' && tw`ring-offset-gray-800`,
  ];
  if (href) {
    return (
      <Link href={href} passHref>
        <a
          data-test={testId}
          ref={ref}
          css={css}
          onClick={onClick as any}
          className={className}
        >
          {inner}
        </a>
      </Link>
    );
  }
  return (
    <button
      disabled={isDisabled}
      css={css}
      type={htmlType}
      onClick={onClick as any}
      className={className}
    >
      {inner}
    </button>
  );
});
