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
          tw="h-8 w-auto sm:h-8"
          src={black ? logo_black.src : logo.src}
          alt=""
        />
      </a>
    </Link>
  );
}
