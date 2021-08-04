import { Notifier } from '@pvd/tester';
import { SocketMessage, TestInfo, TestSubmissionLambdaOutput } from 'shared';
import { updateTestResult } from 'shared/src/utils';

export class InMemoryNotifier implements Notifier {
  private tests: TestInfo[] = null!;
  private result: 'PASS' | 'FAIL' | null = null;

  constructor() {}

  async flush() {}

  async notify(action: SocketMessage) {
    const state = {
      tests: this.tests,
      result: this.result,
    };
    updateTestResult(state, action);
    this.tests = state.tests;
    this.result = state.result;
  }

  getTestOutput(): TestSubmissionLambdaOutput {
    return {
      testRun: this.tests,
      success: this.result === 'PASS',
    };
  }
}
