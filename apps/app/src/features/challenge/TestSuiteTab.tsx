import {
  faAngleRight,
  faExclamationCircle,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import tw from 'twin.macro';
import { Button } from '../../components/Button';
import { ModalRef } from '../../components/GenericModal';
import { SolutionModal } from './SolutionModal';
import { TabTitle } from './TabTitle';
import { useTesterActions, useTesterState } from './TesterModule';

export function TestSuiteTab() {
  const modalRef = React.useRef<ModalRef>(null!);
  const { tests, result, submissionId, isShared } = useTesterState();
  const { markAsShared } = useTesterActions();
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
      {result === 'FAIL' && (
        <div tw="bg-red-200 text-red-600 font-bold text-center rounded-sm p-1 mt-3">
          FAIL
        </div>
      )}
      {result === 'PASS' && (
        <div tw="bg-green-200 text-green-600 font-bold text-center rounded-sm p-1 mt-3">
          PASS
        </div>
      )}
      {result === 'PASS' && !isShared && (
        <Button
          tw="mt-2"
          block
          type="light"
          focusBg="gray-900"
          onClick={() => {
            modalRef.current.open();
          }}
          disabled={isShared}
        >
          Share Your Solution!
        </Button>
      )}
      <SolutionModal
        ref={modalRef}
        submissionId={submissionId!}
        markAsShared={markAsShared}
      />
    </div>
  );
}
