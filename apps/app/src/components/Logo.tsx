import Link from 'next/link';
import logo_black from '../../public/logo-black.png';
import logo from '../../public/logo.png';

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
        <img
          {...rest}
          alt=""
          tw="h-8 w-auto sm:h-8"
          {...(black ? logo_black : logo)}
        />
      </a>
    </Link>
  );
}
