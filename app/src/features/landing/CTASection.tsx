import React from 'react';
import { createUrl } from '../../common/url';
import { Button } from '../../components/Button';

export default function CTASection() {
  return (
    <div className="bg-indigo-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-24 lg:px-8 lg:flex lg:items-center lg:justify-between">
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 md:text-4xl">
          <span className="block">Ready to dive in?</span>
          <span className="block text-indigo-600">Start coding today.</span>
        </h2>
        <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
          <div className="inline-flex rounded-md shadow">
            <Button
              size="large"
              type="primary"
              href={createUrl({ name: 'register' })}
            >
              Get started
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
