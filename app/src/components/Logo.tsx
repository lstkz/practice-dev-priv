import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/">
      <a>
        <span className="sr-only">Practice.dev</span>
        <img
          className="h-8 w-auto sm:h-10"
          src="https://tailwindui.com/img/logos/workflow-mark-indigo-500.svg"
          alt=""
        />
      </a>
    </Link>
  );
}
