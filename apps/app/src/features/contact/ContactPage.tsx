import React from 'react';
import { Container } from 'src/components/Container';
import Dashboard from 'src/components/Dashboard';
import { ContactMail } from 'src/components/LegalPage';
import { DISCORD_LINK } from 'src/config';

const faqs = [
  {
    id: 1,
    question: 'Found a bug?',
    answer: (
      <>
        Please create an issue on Github{' '}
        <a href="https://github.com/practice-dev/practice-dev/issues/new">
          here
        </a>
        .{' '}
      </>
    ),
  },
  {
    id: 2,
    question: 'Need help with programming?',
    answer: (
      <>
        Ask for help in our <a href={DISCORD_LINK}>Discord community</a> or in{' '}
        <a href="https://github.com/practice-dev/practice-dev/discussions">
          Github discussions
        </a>
        .
      </>
    ),
  },
  {
    id: 3,
    question: 'General question?',
    answer: (
      <>
        You can contact us directly at <ContactMail />.
      </>
    ),
  },
];

export function ContactPage() {
  return (
    <Dashboard>
      <Container>
        <div tw="max-w-md mx-auto py-24 px-4 sm:max-w-3xl sm:py-32 sm:px-6 lg:max-w-7xl lg:px-8">
          <div tw="lg:grid lg:grid-cols-3 lg:gap-8">
            <div>
              <h2 tw="text-3xl font-extrabold text-gray-900">Get in touch</h2>
              <p tw="mt-4 text-lg text-gray-500">
                Please use the correct method to communicate with us.
              </p>
            </div>
            <div tw="mt-12 lg:mt-0 lg:col-span-2">
              <dl tw="space-y-12">
                {faqs.map(faq => (
                  <div key={faq.id}>
                    <dt tw="text-lg font-medium text-gray-900">
                      {faq.question}
                    </dt>
                    <dd tw="mt-2 text-base text-gray-500">{faq.answer}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </Container>
    </Dashboard>
  );
}
