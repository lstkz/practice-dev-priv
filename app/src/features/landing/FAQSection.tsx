const faqs = [
  {
    id: 1,
    question: 'Is it free?',
    answer: 'Yes! You can solve all challenges for free without any limits.',
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
    question: 'Can I add my custom challenge?',
    answer: (
      <>
        Yes, please visit our Github{' '}
        <a href="https://github.com" target="_blank">
          here
        </a>
        .
      </>
    ),
  },
];

export function FAQSection() {
  return (
    <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-20 lg:px-8">
      <div className="lg:grid lg:grid-cols-3 lg:gap-8">
        <div className="space-y-4">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Frequently asked questions
          </h2>
          <p className="text-lg text-gray-500">
            Can’t find the answer you’re looking for? Reach out to our{' '}
            <a
              href="#"
              className="font-medium text-purple-600 hover:text-purple-500"
            >
              customer support
            </a>{' '}
            team.
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
