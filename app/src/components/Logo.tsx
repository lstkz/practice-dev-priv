import Link from 'next/link';

interface LogoProps {
  className?: string;
  black?: boolean;
}

export function Logo(props: LogoProps) {
  const { black, ...rest } = props;
  return (
    <Link href="/">
      <a>
        <span className="sr-only">Practice.dev</span>
        <img
          {...rest}
          tw="h-8 w-auto sm:h-8"
          src={
            black
              ? require('../../public/logo-black.png')
              : require('../../public/logo.png')
          }
          alt=""
        />
      </a>
    </Link>
  );
}
