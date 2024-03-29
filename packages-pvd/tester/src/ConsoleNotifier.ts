import chalk from 'chalk';
import { TesterSocketMessage, TestInfo } from '@pvd/types';
import { Notifier } from './types';

export class ConsoleNotifier implements Notifier {
  private tests: TestInfo[] | null = null;

  private getTest(id: number) {
    return this.tests!.find(x => x.id === id)!;
  }

  async flush() {
    //
  }

  async notify(action: TesterSocketMessage) {
    switch (action.type) {
      case 'TEST_INFO': {
        this.tests = action.payload.tests;
        break;
      }
      case 'TEST_RESULT': {
        console.log(action.payload.success ? 'PASS' : 'FAIL');
        break;
      }
      case 'TEST_START': {
        const test = this.getTest(action.payload.testId);
        console.log(` Test ${test.id}: ${test.name}`);
        break;
      }
      case 'TEST_STEP': {
        const msg = '    ' + chalk.gray(action.payload.text);
        if (action.payload.data) {
          console.log(msg, action.payload.data);
        } else {
          console.log(msg);
        }
        break;
      }
      case 'TEST_PASS': {
        console.log(chalk.green('    ✓ PASS'));
        break;
      }
      case 'TEST_FAIL': {
        console.log(chalk.red('    ✕ FAIL'));
        console.error('  ' + chalk.red(action.payload.error));
        break;
      }
    }
  }
}
