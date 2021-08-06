import { mocked } from 'ts-jest/utils';
import { execContract, resetDb, setupDb } from '../helper';
import { registerSampleUsers } from '../seed-data';
import { dispatchTask } from '../../src/dispatch';
import { resendVerificationCode } from '../../src/contracts/user/resendVerificationCode';

jest.mock('../../src/dispatch');

setupDb();

const mocked_dispatchTask = mocked(dispatchTask);

beforeEach(async () => {
  await registerSampleUsers(false);
});

it('should throw error if already verified', async () => {
  await resetDb();
  await registerSampleUsers(true);
  await expect(
    execContract(resendVerificationCode, {}, 'user1_token')
  ).rejects.toThrowErrorMatchingInlineSnapshot(`"User is already verified"`);
  expect(mocked_dispatchTask).not.toBeCalled();
});

it('should submit verification code', async () => {
  await execContract(resendVerificationCode, {}, 'user1_token');
  expect(mocked_dispatchTask).toBeCalled();
});
