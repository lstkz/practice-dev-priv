import Link from 'next/link';

interface LogoProps {
  className?: string;
}

export function Logo(props: LogoProps) {
  return (
    <Link href="/">
      <a>
        <span className="sr-only">Practice.dev</span>
        <img
          {...props}
          tw="h-8 w-auto sm:h-10"
          src="https://tailwindui.com/img/logos/workflow-mark-indigo-500.svg"
          alt=""
        />
      </a>
    </Link>
  );
}
