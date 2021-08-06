import { mocked } from 'ts-jest/utils';
import * as DateFns from 'date-fns';
import { ConfirmEmailCodeCollection } from '../../src/collections/ConfirmEmailCode';
import { confirmEmail } from '../../src/contracts/user/confirmEmail';
import { execContract, getId, setupDb } from '../helper';
import { registerSampleUsers } from '../seed-data';
import { dispatchEvent } from '../../src/dispatch';

jest.mock('../../src/dispatch');

setupDb();

const mocked_dispatchEvent = mocked(dispatchEvent);

beforeEach(async () => {
  await registerSampleUsers(false);
  await ConfirmEmailCodeCollection.insertOne({
    _id: '123',
    userId: getId(1),
  });
  mocked_dispatchEvent.mockClear();
});

it('throw error if invalid code', async () => {
  await expect(execContract(confirmEmail, { code: '333' })).rejects.toThrow(
    'Invalid code'
  );
});

it('should confirm email', async () => {
  const ret = await execContract(confirmEmail, { code: '123' });
  expect(ret.user.isVerified).toEqual(true);
  expect(mocked_dispatchEvent).toBeCalledTimes(1);
});

it('should confirm email multiple times if < 2h', async () => {
  await execContract(confirmEmail, { code: '123' });
  const ret = await execContract(confirmEmail, { code: '123' });
  expect(ret.user.isVerified).toEqual(true);
  expect(mocked_dispatchEvent).toBeCalledTimes(1);
});

it('should throw an error if > 2h', async () => {
  Date.now = () => new Date(0).getTime();
  await execContract(confirmEmail, { code: '123' });
  Date.now = () => DateFns.add(new Date(0), { hours: 3 }).getTime();
  await expect(confirmEmail('123')).rejects.toThrow('Account already verified');
});
