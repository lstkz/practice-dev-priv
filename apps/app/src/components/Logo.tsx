import Link from 'next/link';
import React from 'react';
import tw from 'twin.macro';
import logo_black from '../../public/logo-black.png';
import logo from '../../public/logo.png';
import { CustomImage } from './CustomImage';

interface LogoProps {
  imgCss?: any;
  black?: boolean;
  href?: string;
}

export function Logo(props: LogoProps) {
  const { black, href, imgCss, ...rest } = props;

  return (
    <Link href={href ?? '/'}>
      <a>
        <span className="sr-only">Practice.dev</span>
        <CustomImage
          css={[tw`h-8 w-auto`, imgCss]}
          {...rest}
          alt=""
          {...(black ? logo_black : logo)}
        />
      </a>
    </Link>
  );
}
