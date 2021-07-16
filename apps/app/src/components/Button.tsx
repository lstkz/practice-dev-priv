import Link from 'next/link';
import React from 'react';
import tw from 'twin.macro';
import { SpinnerBoarder } from './SpinnerBoarder';

export interface BaseButtonProps {
  type: 'primary' | 'dark' | 'gray' | 'white' | 'light';
  disabled?: boolean;
  block?: boolean;
  size?: 'small' | 'default' | 'large';
  focusBg?: 'gray-800' | 'gray-900';
}

interface ButtonProps
  extends Pick<React.HTMLAttributes<HTMLElement>, 'onFocus' | 'onBlur'>,
    BaseButtonProps {
  children?: React.ReactNode;
  className?: string;
  css?: any;
  htmlType?: 'button' | 'submit' | 'reset';
  icon?: React.ReactNode;
  loading?: boolean;
  href?: string;
  onClick?: (
    e: React.MouseEvent<HTMLAnchorElement | HTMLDivElement, MouseEvent>
  ) => void;
  testId?: string;
}

export function getBaseButtonStyles(props: BaseButtonProps) {
  const { type, block, disabled, focusBg, size } = props;
  return [
    tw`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md justify-center`,
    tw`focus:( outline-none ring-2 ring-offset-2 )`,
    block && tw`w-full`,
    disabled && tw`hover:cursor-default`,
    type === 'gray' && [
      tw`text-white bg-gray-600`,
      tw`hover:( bg-gray-700 )`,
      tw`focus:( ring-gray-700 )`,
    ],
    type === 'dark' && [
      tw`text-white bg-gray-800`,
      tw`hover:( bg-gray-900 )`,
      tw`focus:( ring-gray-900  )`,
    ],
    type === 'primary' && [
      tw`text-white bg-indigo-600 `,
      tw`hover:( bg-indigo-700 )`,
      tw`focus:( ring-indigo-500 )`,
      disabled && tw`bg-indigo-400!`,
    ],
    type === 'white' && [
      tw`text-gray-700 bg-white border border-gray-300`,
      tw`hover:( bg-gray-50 )`,
      tw`focus:( ring-indigo-500   )`,
    ],
    type === 'light' && [
      tw` bg-indigo-300 text-black`,
      tw`hover:( bg-indigo-400 )`,
      tw`focus:( ring-indigo-500   )`,
    ],
    size === 'small' && tw`text-sm px-2 py-1 rounded`,
    size === 'large' && tw`px-5 py-3 text-base`,
    getFocusBgTw(focusBg),
  ];
}

export type FocusBg = 'gray-800' | 'gray-900';

export function getFocusBgTw(focusBg: FocusBg | undefined) {
  if (focusBg === 'gray-800') {
    return tw`ring-offset-gray-800`;
  }
  if (focusBg === 'gray-900') {
    return tw`ring-offset-gray-900`;
  }
  return null;
}

export const Button = React.forwardRef((props: ButtonProps, ref: any) => {
  const {
    htmlType,
    loading,
    icon,
    children,
    disabled,
    testId,
    href,
    onClick,
    className,
    ...rest
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
  const css = getBaseButtonStyles({
    ...props,
    disabled: isDisabled,
  });
  if (href) {
    return (
      <Link href={href} passHref {...rest}>
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
      {...rest}
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
