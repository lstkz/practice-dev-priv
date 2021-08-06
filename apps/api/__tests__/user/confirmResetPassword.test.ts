import * as DateFns from 'date-fns';
import { ResetPasswordCodeCollection } from '../../src/collections/ResetPasswordCode';
import { confirmResetPassword } from '../../src/contracts/user/confirmResetPassword';
import { execContract, getId, setupDb } from '../helper';
import { registerSampleUsers } from '../seed-data';

jest.mock('../../src/dispatch');

setupDb();

beforeEach(async () => {
  await registerSampleUsers();
  await ResetPasswordCodeCollection.insertOne({
    _id: 'code123',
    expireAt: DateFns.addDays(new Date(), 1),
    userId: getId(1),
  });
});

it('confirm reset password successfully', async () => {
  const ret = await execContract(confirmResetPassword, {
    code: 'code123',
    newPassword: 'password',
  });
  expect(ret.user.id).toEqual(getId(1).toString());
});

it('should throw if code not found', async () => {
  await expect(
    execContract(confirmResetPassword, {
      code: '123456',
      newPassword: 'password',
    })
  ).rejects.toMatchInlineSnapshot(`[AppError: Invalid or used reset code]`);
});

it('should throw if code expired', async () => {
  await ResetPasswordCodeCollection.insertOne({
    _id: 'expired123',
    expireAt: DateFns.addDays(new Date(), -1),
    userId: getId(1),
  });
  await expect(
    execContract(confirmResetPassword, {
      code: 'expired123',
      newPassword: 'password',
    })
  ).rejects.toMatchInlineSnapshot(
    `[AppError: Expired code. Please request password reset again.]`
  );
});
