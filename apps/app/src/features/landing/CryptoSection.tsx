import {
  ChatAltIcon,
  DocumentReportIcon,
  HeartIcon,
  InboxIcon,
  PencilAltIcon,
  ReplyIcon,
  TrashIcon,
  UsersIcon,
} from '@heroicons/react/outline';
import { CRYPTO_LINK } from 'src/config';
import tw, { styled } from 'twin.macro';

const features = [
  {
    name: 'Unlimited Inboxes',
    description:
      'Ac tincidunt sapien vehicula erat auctor pellentesque rhoncus. Et magna sit morbi lobortis.',
    icon: InboxIcon,
  },
  {
    name: 'Manage Team Members',
    description:
      'Ac tincidunt sapien vehicula erat auctor pellentesque rhoncus. Et magna sit morbi lobortis.',
    icon: UsersIcon,
  },
  {
    name: 'Spam Report',
    description:
      'Ac tincidunt sapien vehicula erat auctor pellentesque rhoncus. Et magna sit morbi lobortis.',
    icon: TrashIcon,
  },
  {
    name: 'Compose in Markdown',
    description:
      'Ac tincidunt sapien vehicula erat auctor pellentesque rhoncus. Et magna sit morbi lobortis.',
    icon: PencilAltIcon,
  },
  {
    name: 'Team Reporting',
    description:
      'Ac tincidunt sapien vehicula erat auctor pellentesque rhoncus. Et magna sit morbi lobortis.',
    icon: DocumentReportIcon,
  },
  {
    name: 'Saved Replies',
    description:
      'Ac tincidunt sapien vehicula erat auctor pellentesque rhoncus. Et magna sit morbi lobortis.',
    icon: ReplyIcon,
  },
  {
    name: 'Email Commenting',
    description:
      'Ac tincidunt sapien vehicula erat auctor pellentesque rhoncus. Et magna sit morbi lobortis.',
    icon: ChatAltIcon,
  },
  {
    name: 'Connect with Customers',
    description:
      'Ac tincidunt sapien vehicula erat auctor pellentesque rhoncus. Et magna sit morbi lobortis.',
    icon: HeartIcon,
  },
];

export function CryptoSection2() {
  return (
    <div className="bg-indigo-700">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 sm:pt-20 sm:pb-24 lg:max-w-7xl lg:pt-24 lg:px-8">
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          The platform is driven by cryptocurrency.
        </h2>
        <p className="mt-4 max-w-3xl text-lg text-indigo-200">
          We have released an ERC20 token to provide funding for our website.
        </p>
        <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:mt-16 lg:grid-cols-1 lg:gap-x-8 lg:gap-y-16">
          {features.map(feature => (
            <div key={feature.name}>
              <div>
                <span className="flex items-center justify-center h-12 w-12 rounded-md bg-white bg-opacity-10">
                  <feature.icon
                    className="h-6 w-6 text-white"
                    aria-hidden="true"
                  />
                </span>
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-medium text-white">
                  {feature.name}
                </h3>
                <p className="mt-2 text-base text-indigo-200">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

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
          The initial price is <Bold>$0.1</Bold> per token.
          <br />
          We estimate that token will cost <Bold>$5</Bold> per token within a
          year.
        </>
      ),
    },
    {
      question: "What's the total supply?",
      answer: (
        <>
          There are only <Bold>12,500,000</Bold> tokens. Tokens are non-mintable
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
      </div>
    </div>
  );
}
