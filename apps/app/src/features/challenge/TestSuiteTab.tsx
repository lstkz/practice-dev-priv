import {
  faAngleRight,
  faArrowRight,
  faExclamationCircle,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { createUrl } from 'src/common/url';
import { IS_SSR } from 'src/config';
import { useLayoutEffectFix } from 'src/hooks/useLayoutEffectFix';
import tw from 'twin.macro';
import { Button } from '../../components/Button';
import { ModalRef } from '../../components/GenericModal';
import { SolutionModal } from './SolutionModal';
import { TabTitle } from './TabTitle';
import { useTesterActions, useTesterState } from './TesterModule';

declare global {
  interface Element {
    scrollIntoViewIfNeeded(centerIfNeeded?: boolean): void;
  }
}

if (!IS_SSR && !Element.prototype.scrollIntoViewIfNeeded) {
  Element.prototype.scrollIntoViewIfNeeded = function (
    this: any,
    centerIfNeeded
  ) {
    centerIfNeeded = arguments.length === 0 ? true : !!centerIfNeeded;
    const parent = this.parentNode;
    const parentComputedStyle = window.getComputedStyle(parent, null);
    const parentBorderTopWidth = parseInt(
      parentComputedStyle.getPropertyValue('border-top-width')
    );
    const parentBorderLeftWidth = parseInt(
      parentComputedStyle.getPropertyValue('border-left-width')
    );
    const overTop = this.offsetTop - parent.offsetTop < parent.scrollTop;
    const overBottom =
      this.offsetTop -
        parent.offsetTop +
        this.clientHeight -
        parentBorderTopWidth >
      parent.scrollTop + parent.clientHeight;
    const overLeft = this.offsetLeft - parent.offsetLeft < parent.scrollLeft;
    const overRight =
      this.offsetLeft -
        parent.offsetLeft +
        this.clientWidth -
        parentBorderLeftWidth >
      parent.scrollLeft + parent.clientWidth;
    const alignWithTop = overTop && !overBottom;

    if ((overTop || overBottom) && centerIfNeeded) {
      parent.scrollTop =
        this.offsetTop -
        parent.offsetTop -
        parent.clientHeight / 2 -
        parentBorderTopWidth +
        this.clientHeight / 2;
    }

    if ((overLeft || overRight) && centerIfNeeded) {
      parent.scrollLeft =
        this.offsetLeft -
        parent.offsetLeft -
        parent.clientWidth / 2 -
        parentBorderLeftWidth +
        this.clientWidth / 2;
    }

    if ((overTop || overBottom || overLeft || overRight) && !centerIfNeeded) {
      this.scrollIntoView(alignWithTop);
    }
  };
}

function NextChallengeButton() {
  const { nextChallengeInfo } = useTesterState();
  if (!nextChallengeInfo) {
    return null;
  }
  if (!nextChallengeInfo.next) {
    return (
      <div tw="bg-blue-200 text-gray-900 font-medium text-center rounded-sm p-1 mt-3">
        Module completed
      </div>
    );
  }
  return (
    <Button
      tw="mt-2"
      block
      type="light"
      focusBg="gray-900"
      href={createUrl({ name: 'challenge', slug: nextChallengeInfo.next.slug })}
      disabled
    >
      Next Challenge <FontAwesomeIcon tw="ml-2" icon={faArrowRight} />
    </Button>
  );
}

export function TestSuiteTab() {
  const modalRef = React.useRef<ModalRef>(null!);
  const { tests, result, submissionId, isShared } = useTesterState();
  const { markAsShared } = useTesterActions();
  const ref = React.useRef<HTMLDivElement>(null!);
  useLayoutEffectFix(() => {
    const test =
      tests.find(x => x.result === 'pending') ||
      [...tests].reverse().find(x => x.result !== 'fail-skipped');
    if (test) {
      const node = document.getElementById('test-' + test.id);
      if (node?.scrollIntoViewIfNeeded) {
        node.scrollIntoViewIfNeeded();
      }
    }
  }, [tests]);
  return (
    <div tw="flex flex-col h-full">
      <TabTitle>Test Suite</TabTitle>
      <div tw="divide-y divide-gray-700 overflow-auto" ref={ref}>
        {tests.map(test => {
          const textColor = [
            test.result === 'pass' && tw`text-green-400`,
            test.result === 'fail' && tw`text-red-400`,
          ];
          return (
            <div key={test.id} tw="text-gray-300 py-4" id={`test-${test.id}`}>
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
      <div>
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
          >
            Share Your Solution!
          </Button>
        )}
        {result === 'PASS' && <NextChallengeButton />}
      </div>
      <SolutionModal
        ref={modalRef}
        submissionId={submissionId!}
        markAsShared={markAsShared}
      />
    </div>
  );
}
