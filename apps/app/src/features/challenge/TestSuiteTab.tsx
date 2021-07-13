import {
  faAngleRight,
  faExclamationCircle,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import tw from 'twin.macro';
import { Button } from '../../components/Button';
import { ModalRef } from '../../components/Modal';
import { SolutionModal } from './SolutionModal';
import { TabTitle } from './TabTitle';

export interface Step {
  text: string;
  data?: any;
}

export interface TestInfo {
  id: number;
  name: string;
  error?: string;
  steps: Step[];
  result: TestResult;
}

export type TestResult =
  | 'pass'
  | 'fail'
  | 'pending'
  | 'running'
  | 'fail-skipped';

const tests: TestInfo[] = [
  {
    id: 1,
    name: 'navigate to page',
    result: 'pass',
    steps: [
      {
        text: 'Navigate to "http://example.org"',
      },
      {
        text: 'Lorem ipsum',
      },
    ],
  },
  {
    id: 2,
    name: 'verify count label, increase and decrease buttons are visible',
    result: 'fail',
    error:
      'waiting for selector "[data-test="count-value"]" failed: timeout 3500ms exceeded',
    steps: [
      {
        text: 'Expect "[data-test="count-value"]" to be visible',
      },
    ],
  },
  {
    id: 3,
    name: 'count should display 0 by default',
    result: 'running',
    steps: [],
  },
  {
    id: 4,
    name: 'click increment button 3 times',
    result: 'fail-skipped',
    steps: [],
  },
  {
    id: 5,
    name: 'click decrement button 2 times',
    result: 'fail-skipped',
    steps: [],
  },
];

export function TestSuiteTab() {
  const modalRef = React.useRef<ModalRef>(null!);
  return (
    <div>
      <TabTitle>Test Suite</TabTitle>
      <div tw="divide-y divide-gray-700">
        {tests.map(test => {
          const textColor = [
            test.result === 'pass' && tw`text-green-400`,
            test.result === 'fail' && tw`text-red-400`,
          ];
          return (
            <div key={test.id} tw="text-gray-300 py-4">
              <div tw="w-20 font-bold whitespace-nowrap" css={textColor}>
                Test {test.id}:
              </div>
              <div css={textColor}>
                {test.result === 'running' && (
                  <FontAwesomeIcon
                    tw="text-indigo-300 text-sm animate-spin-slow mr-2"
                    icon={faSpinner}
                  />
                )}
                {test.name}
                {test.steps.map((step, i) => (
                  <div tw="text-gray-400" key={i}>
                    <FontAwesomeIcon icon={faAngleRight} /> {step.text}
                  </div>
                ))}
                {test.error && (
                  <div tw="mt-2">
                    <FontAwesomeIcon icon={faExclamationCircle} tw="mr-2" />
                    {test.error}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div tw="bg-red-200 text-red-600 font-bold text-center rounded-sm p-1 mt-3">
        FAIL
      </div>
      <div tw="bg-green-200 text-green-600 font-bold text-center rounded-sm p-1 mt-3">
        PASS
      </div>
      <Button
        tw="mt-2"
        block
        type="light"
        focusBg="gray-900"
        onClick={() => {
          modalRef.current.open();
        }}
      >
        Share Your Solution!
      </Button>
      <SolutionModal ref={modalRef} />
    </div>
  );
}
