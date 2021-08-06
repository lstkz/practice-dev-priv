import { mocked } from 'ts-jest/utils';
import { resetPassword } from '../../src/contracts/user/resetPassword';
import { dispatchTask } from '../../src/dispatch';
import { execContract, setupDb } from '../helper';
import { registerSampleUsers } from '../seed-data';

jest.mock('../../src/dispatch');

const mocked_dispatchTask = mocked(dispatchTask);

setupDb();

beforeEach(async () => {
  await registerSampleUsers();
});

it('reset password successfully by email', async () => {
  await execContract(resetPassword, { usernameOrEmail: 'user1@example.com' });
  expect(mocked_dispatchTask).toBeCalled();
});

it('reset password successfully by username', async () => {
  await execContract(resetPassword, { usernameOrEmail: 'user1' });
  expect(mocked_dispatchTask).toBeCalled();
});

it('should throw if user not found', async () => {
  await expect(
    execContract(resetPassword, { usernameOrEmail: 'user234' })
  ).rejects.toMatchInlineSnapshot(`[AppError: User not found]`);
});
