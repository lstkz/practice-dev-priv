import { mocked } from 'ts-jest/utils';
import { ConfirmEmailChangeCollection } from '../../src/collections/ConfirmEmailChange';
import { UserCollection } from '../../src/collections/User';
import { changeEmail } from '../../src/contracts/user/changeEmail';
import { dispatchTask } from '../../src/dispatch';
import { execContract, getId, setupDb } from '../helper';
import { registerSampleUsers } from '../seed-data';

jest.mock('../../src/dispatch');

const mocked_dispatchTask = mocked(dispatchTask);

setupDb();

beforeEach(async () => {
  await registerSampleUsers();
});

it('should throw if invalid email', async () => {
  await expect(
    execContract(changeEmail, { newEmail: 'asd$5' }, 'user1_token')
  ).rejects.toMatchInlineSnapshot(
    `[Error: Validation error: 'newEmail' must a valid email.]`
  );
});

it('should throw if duplicated', async () => {
  await expect(
    execContract(changeEmail, { newEmail: 'useR2@example.com' }, 'user1_token')
  ).rejects.toMatchInlineSnapshot(`[AppError: Email is already taken]`);
});

it('should change only case if email is the same', async () => {
  const ret = await execContract(
    changeEmail,
    { newEmail: 'USER1@example.com' },
    'user1_token'
  );
  expect(ret).toEqual({ ok: false });
  const user = await UserCollection.findByIdOrThrow(getId(1));
  expect(user.email).toEqual('USER1@example.com');
  expect(mocked_dispatchTask).not.toBeCalled();
});

it('should make a change email request', async () => {
  const ret = await execContract(
    changeEmail,
    { newEmail: 'fooo@example.com' },
    'user1_token'
  );
  expect(ret).toEqual({ ok: true });
  const user = await UserCollection.findByIdOrThrow(getId(1));
  expect(user.email).toEqual('user1@example.com');
  expect(mocked_dispatchTask).toBeCalled();
  const requests = await ConfirmEmailChangeCollection.findAll({});
  expect(requests).toHaveLength(1);
});
