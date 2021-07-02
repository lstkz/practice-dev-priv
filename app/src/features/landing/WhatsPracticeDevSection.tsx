/* This example requires Tailwind CSS v2.0+ */
import {
  AnnotationIcon,
  GlobeAltIcon,
  LightningBoltIcon,
  ScaleIcon,
  CodeIcon,
  TerminalIcon,
  UserGroupIcon,
  CheckCircleIcon,
  EmojiHappyIcon,
  AcademicCapIcon,
} from '@heroicons/react/outline';

const features = [
  {
    name: 'Many Challenges',
    description:
      "We've prepared many challenges that reflect problems from real projects. A challenge is a simple task that focuses on a particular area.",
    icon: CodeIcon,
  },
  {
    name: 'Embedded VS Code',
    description:
      'No setup required. Code directly in the browser using an embedded IDE with full autocomplete and type checking.',
    icon: TerminalIcon,
  },
  {
    name: 'Not Only for Beginners',
    description:
      'Not for juniors only. Try our hard challenges that are not easy to solve!',
    icon: UserGroupIcon,
  },
  {
    name: 'Automatic Testing',
    description:
      'All your work is verified automatically by our testing engine. You can submit an unlimited number of times. There are no fees!',
    icon: CheckCircleIcon,
  },
  {
    name: 'Learn from others',
    description:
      'You can view shared solutions created by other users, and see how their approached the problem.',
    icon: AcademicCapIcon,
  },
  {
    name: 'Open Source',
    description:
      'We love open-source! All challenges are open-sourced. If you have an idea for a challenge or found a bug, feel free to submit a pull request.',
    icon: EmojiHappyIcon,
  },
];

export function WhatsPracticeDevSection() {
  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            What's Practice.dev?
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            A better way to learn programming.
            {/* It's a complete platform for learning programming. */}
          </p>
        </div>

        <div className="mt-10">
          <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            {features.map(feature => (
              <div key={feature.name} className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                    {feature.name}
                  </p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  {feature.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
