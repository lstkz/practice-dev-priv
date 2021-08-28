import Link from 'next/link';
import { createUrl } from 'src/common/url';
import { Logo } from './Logo';

interface ErrorPageProps {
  error: string;
  title: string;
  description: string;
}

export default function ErrorPage(props: ErrorPageProps) {
  const { error, title, description } = props;
  return (
    <div tw="min-h-screen pt-16 pb-12 flex flex-col bg-white">
      <main tw="flex-grow flex flex-col justify-center max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div tw="flex-shrink-0 flex justify-center">
          <Logo black />
        </div>
        <div tw="py-16">
          <div tw="text-center">
            <p tw="text-sm font-semibold text-indigo-600 uppercase tracking-wide">
              {error}
            </p>
            <h1 tw="mt-2 text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
              {title}
            </h1>
            <p tw="mt-2 text-base text-gray-500">{description}</p>
            <div tw="mt-6">
              <Link passHref href={createUrl({ name: 'home' })}>
                <a tw="text-base font-medium text-indigo-600 hover:text-indigo-500">
                  Go back home<span aria-hidden="true"> &rarr;</span>
                </a>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <footer tw="flex-shrink-0 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <nav tw="flex justify-center space-x-4">
          <Link passHref href={createUrl({ name: 'contact-us' })}>
            <a tw="text-sm font-medium text-gray-500 hover:text-gray-600">
              Contact
            </a>
          </Link>
        </nav>
      </footer>
    </div>
  );
}
