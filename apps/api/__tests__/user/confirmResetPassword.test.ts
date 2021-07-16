import { gql } from 'apollo-server';
import * as DateFns from 'date-fns';
import { ResetPasswordCodeCollection } from '../../src/collections/ResetPasswordCode';
import { confirmResetPassword } from '../../src/contracts/user/confirmResetPassword';
import { apolloServer } from '../../src/server';
import { getId, setupDb } from '../helper';
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
  const ret = await confirmResetPassword('code123', 'password');
  expect(ret.user.id).toEqual(getId(1).toString());
});

it('should throw if code not found', async () => {
  await expect(
    confirmResetPassword('123456', 'password')
  ).rejects.toMatchInlineSnapshot(`[AppError: Invalid or used reset code]`);
});

it('should throw if code expired', async () => {
  await ResetPasswordCodeCollection.insertOne({
    _id: 'expired123',
    expireAt: DateFns.addDays(new Date(), -1),
    userId: getId(1),
  });
  await expect(
    confirmResetPassword('expired123', 'password')
  ).rejects.toMatchInlineSnapshot(
    `[AppError: Expired code. Please request password reset again.]`
  );
});

it('reset password successfully #graphql', async () => {
  const res = await apolloServer.executeOperation({
    query: gql`
      mutation {
        confirmResetPassword(code: "code123", newPassword: "password") {
          user {
            id
            username
          }
        }
      }
    `,
  });
  expect(res.data).toMatchInlineSnapshot(`
    Object {
      "confirmResetPassword": Object {
        "user": Object {
          "id": "000000000000000000000001",
          "username": "user1",
        },
      },
    }
  `);
  expect(res.errors).toBeFalsy();
});
