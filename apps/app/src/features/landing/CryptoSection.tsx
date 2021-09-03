import React from 'react';
import { CRYPTO_LINK } from 'src/config';
import tw, { styled } from 'twin.macro';
import { CryptoSubSection } from './CryptoSubSection';

const Bold = styled.strong`
  ${tw`font-semibold text-white`}
`;

export function CryptoSection() {
  const items = [
    {
      question: 'Why crypto?',
      answer: (
        <>
          Free platforms still need to have some source of income. One possible
          way is to ask for donations. Crypto is an alternative that allows
          raising money quickly, and also it's an investment for users.
        </>
      ),
    },
    {
      question: 'Can I earn crypto?',
      answer: (
        <>
          Yes! You can earn crypto royalties by contributing to content (e.g.
          creating challenges or the whole modules) on the platform.
          <br />
          Every year we will award from <Bold>$100,000</Bold> to{' '}
          <Bold>$1,000,000</Bold> in crypto to all contributors proportionally.
        </>
      ),
    },
    {
      question: "What's the token price?",
      answer: (
        <>
          The initial price is <Bold>$1</Bold> per token, and the price will
          never drop below that.
          <br />
          We hope that token will cost <Bold>$10</Bold> per token within a year.
        </>
      ),
    },
    {
      question: "What's the total supply?",
      answer: (
        <>
          There are only <Bold>1,250,000</Bold> tokens. Tokens are non-mintable
          (it won't be possible to release more tokens).
        </>
      ),
    },
    {
      question: "What's the token distribution?",
      answer: (
        <>
          <Bold>80%</Bold> of tokens are available to buy on Uniswap.
          <br />
          <Bold>20%</Bold> of tokens are reserved for royalties.
          <br />
          There are no tokens reserved for the platform. The platform will make
          money on Uniswap fees (<Bold>1%</Bold> of all transactions).
        </>
      ),
    },
    {
      question: 'Where can I buy it?',
      answer: (
        <>
          You can buy it on{' '}
          <a
            target="_blank"
            href={CRYPTO_LINK}
            rel="nofollow"
            className="text-blue-400"
          >
            Uniswap.
          </a>
          <br />
          Make sure to buy crypto through this link. Do not open links sent by
          other people!
        </>
      ),
    },
  ];

  return (
    <div className="bg-gray-900">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="lg:max-w-2xl lg:mx-auto lg:text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            The platform is driven by cryptocurrency
          </h2>
          <p className="mt-4 text-gray-400">
            We have released an ERC20 token to provide funding for our website.
          </p>
        </div>
        <div className="mt-20">
          <dl className="space-y-10 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:gap-y-10">
            {items.map((faq, i) => (
              <div key={i}>
                <dt className="font-semibold text-white text-lg">
                  {faq.question}
                </dt>
                <dd className="mt-3 text-gray-400">{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
        <CryptoSubSection />
      </div>
    </div>
  );
}
