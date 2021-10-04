import Link from 'next/link';
import React from 'react';
import { createUrl } from 'src/common/url';
import { ENABLE_CRYPTO } from 'src/config';
import tw, { styled } from 'twin.macro';

const CodeWrapper = styled.div`
  code {
    ${tw`bg-indigo-50 text-indigo-500 px-2 rounded-sm leading-loose`}
  }
`;

const List = styled.ul`
  ${tw`mb-2 list-disc ml-8`}
`;

interface FaqItem {
  id: number;
  question: string;
  answer: JSX.Element;
}

export function FAQSection() {
  const faqs = [
    {
      id: 1,
      question: 'Is it really free?',
      answer: (
        <>
          Yes! You can solve all challenges for free without any limits.
          {ENABLE_CRYPTO && (
            <>
              <br />
              <strong className="font-semibold text-gray-900">
                You don't have to buy any crypto to use the website!
              </strong>
            </>
          )}
        </>
      ),
    },
    {
      id: 2,
      question: 'What languages and technologies do you support?',
      answer:
        'Currently, only React and Typescript. More stacks will be added in the future.',
    },
    {
      id: 3,
      question: 'Is there only frontend?',
      answer:
        'Yes, but backend technologies are planned to be added in the future.',
    },
    {
      id: 4,
      question: 'How can I add my module or challenges?',
      answer: (
        <>
          Please contact us{' '}
          <Link href={createUrl({ name: 'contact-us' })}>
            <a>here</a>
          </Link>
          .
          <br />
          We highly encourage open-source maintainers from popular frameworks or
          libraries to contribute.
        </>
      ),
    },
    ENABLE_CRYPTO && {
      id: 5,
      question: 'How will crypto royalties be calculated?',
      answer: (
        <CodeWrapper>
          Royalties will be calculated proportionally based on the module or
          challenge popularity.
          <div tw="italic my-2">Example:</div>
          Assume there are:
          <List>
            <li>
              <code>100,000</code> users,
            </li>
            <li>
              <code>500</code> challenges,
            </li>
            <li>
              every user participates in <code>40</code> challenges on average.
            </li>
          </List>
          That gives us <code>4,000,000</code> participants on the whole
          platform.
          <br />
          If your challenges have <code>400,000</code> participants, then you
          will receive: <br /> <code>$POOL * 400,000/4,000,000</code>.
          <br />
          If <code>$POOL</code> is <code>$1,000,000</code> then you would get{' '}
          <code>$100,000</code>.
        </CodeWrapper>
      ),
    },
  ].filter(Boolean) as FaqItem[];

  return (
    <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-20 lg:px-8">
      <div className="lg:grid lg:grid-cols-3 lg:gap-8">
        <div className="space-y-4">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Frequently asked questions
          </h2>
          <p className="text-lg text-gray-500">
            Can’t find the answer you’re looking for? Contact us{' '}
            <Link href={createUrl({ name: 'contact-us' })} passHref>
              <a className="font-medium text-purple-600 hover:text-purple-500">
                here
              </a>
            </Link>
            .
          </p>
        </div>
        <div className="mt-12 lg:mt-0 lg:col-span-2">
          <dl className="space-y-12">
            {faqs.map(faq => (
              <div key={faq.id}>
                <dt className="text-lg leading-6 font-medium text-gray-900">
                  {faq.question}
                </dt>
                <dd className="mt-2 text-base text-gray-500">{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
