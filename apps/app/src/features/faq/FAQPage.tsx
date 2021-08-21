import { Disclosure } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/outline';
import React from 'react';
import { Container } from 'src/components/Container';
import Dashboard from 'src/components/Dashboard';
import tw from 'twin.macro';

const faqs = [
  {
    question: 'What is practice.dev?',
    answer: (
      <>
        Practice.dev is a platform where programmers solve programming
        challenges from domains such as frontend and/or backend.
        <br />
        All tasks reflect problems that you can face in real jobs.{' '}
      </>
    ),
  },
  {
    question: 'What are challenges?',
    answer: (
      <>
        A challenge is a short programming task, where a developer focuses only
        on a particular area. Challenges very often can be solved in a single
        file or a component. We recommend solving challenges if you need to
        practice solving new problems or testing a new framework or a library.
      </>
    ),
  },
  {
    question: 'Is it required to reuse HTML or CSS code?',
    answer: (
      <>
        We recommend you reuse the provided code, but it's not required.
        <br />
        It's only required to provide the correct <code>data-test</code>{' '}
        attributes on HTML elements.
        <br />
        Also, it's required to use the correct tags for form elements:{' '}
        <code>input, textarea, select</code>.
      </>
    ),
  },
  {
    question: 'What are solutions?',
    answer: (
      <>
        People can create solutions to demonstrate the approach and show how
        they solve the given problem. You can load a solution, and view the full
        code.
      </>
    ),
  },
  {
    question: 'What is the license for the solutions I post?',
    answer: (
      <>
        Any code snippets on practice.dev are distributed under the terms of{' '}
        <a href="https://creativecommons.org/licenses/by-sa/4.0/">
          CC BY-SA 4.0
        </a>
        .
      </>
    ),
  },
  {
    question: 'Can I add a custom library?',
    answer: <>Currently, it's not possible to add a custom npm package.</>,
  },
  {
    question: 'Language and framework versions',
    answer: (
      <>
        Typescript version is 3.3.4. <br />
        React version is 17.0.2.
      </>
    ),
  },
  {
    question: 'Testing environment',
    answer: <>Testing is based on Chromium 92.0.4512.0.</>,
  },
];

export function FAQPage() {
  return (
    <Dashboard>
      <Container>
        <h2 tw="text-center text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Frequently Asked Questions
        </h2>
        <dl tw="mt-6 space-y-6 divide-y divide-gray-200">
          {faqs.map((faq, i) => (
            <Disclosure as={React.Fragment as any} key={i}>
              {({ open }) => (
                <div tw="pt-6">
                  <dt tw="text-lg">
                    <Disclosure.Button tw="text-left w-full flex justify-between items-start text-gray-400">
                      <span tw="font-medium text-gray-900">{faq.question}</span>
                      <span tw="ml-6 h-7 flex items-center">
                        <ChevronDownIcon
                          css={[
                            tw`h-6 w-6 transform`,
                            open ? tw`-rotate-180` : tw`rotate-0`,
                          ]}
                          aria-hidden="true"
                        />
                      </span>
                    </Disclosure.Button>
                  </dt>
                  <Disclosure.Panel as={React.Fragment as any}>
                    <dd tw="mt-2 pr-12">
                      <p tw="text-base text-gray-500">{faq.answer}</p>
                    </dd>
                  </Disclosure.Panel>
                </div>
              )}
            </Disclosure>
          ))}
        </dl>
      </Container>
    </Dashboard>
  );
}
