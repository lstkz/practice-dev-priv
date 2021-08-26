import Link from 'next/link';
import React from 'react';
import logo_black from '../../public/logo-black.png';
import logo from '../../public/logo.png';
import { CustomImage } from './CustomImage';

interface LogoProps {
  className?: string;
  black?: boolean;
  href?: string;
}

export function Logo(props: LogoProps) {
  const { black, href, ...rest } = props;
  return (
    <Link href={href ?? '/'}>
      <a>
        <span className="sr-only">Practice.dev</span>
        <CustomImage
          tw="h-8 w-auto sm:h-8"
          {...rest}
          alt=""
          {...(black ? logo_black : logo)}
        />
      </a>
    </Link>
  );
}
