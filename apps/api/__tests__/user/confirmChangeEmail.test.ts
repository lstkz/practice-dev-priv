import { mocked } from 'ts-jest/utils';
import { ConfirmEmailChangeCollection } from '../../src/collections/ConfirmEmailChange';
import * as DateFns from 'date-fns';
import { UserCollection } from '../../src/collections/User';
import { confirmChangeEmail } from '../../src/contracts/user/confirmChangeEmail';
import { dispatchEvent } from '../../src/dispatch';
import { execContract, getId, setupDb } from '../helper';
import { registerSampleUsers } from '../seed-data';

jest.mock('../../src/dispatch');

const mocked_dispatchEvent = mocked(dispatchEvent);

setupDb();

beforeEach(async () => {
  await registerSampleUsers();
});

const validProps = {
  _id: '123',
  newEmail: 'foO@example.com',
  userId: getId(1),
  expireAt: DateFns.addYears(new Date(), 1),
};

it('should throw error if code not found', async () => {
  await expect(
    execContract(confirmChangeEmail, { code: '123' }, 'user1_token')
  ).rejects.toThrow('Invalid code');
});

it('should throw error if assigned for another user', async () => {
  await ConfirmEmailChangeCollection.insertOne({
    ...validProps,
    userId: getId(2),
  });
  await expect(
    execContract(confirmChangeEmail, { code: '123' }, 'user1_token')
  ).rejects.toThrow('Invalid code');
});

it('should throw error if email taken', async () => {
  await ConfirmEmailChangeCollection.insertOne({
    ...validProps,
    newEmail: 'user2@example.com',
  });
  await expect(
    execContract(confirmChangeEmail, { code: '123' }, 'user1_token')
  ).rejects.toThrow('Cannot change email. Email taken by another user');
});

it('should throw error if expired', async () => {
  await ConfirmEmailChangeCollection.insertOne({
    ...validProps,
    expireAt: new Date(1),
  });
  await expect(
    execContract(confirmChangeEmail, { code: '123' }, 'user1_token')
  ).rejects.toThrow('Token expired. Please request email change again.');
});

it('should change the email', async () => {
  await ConfirmEmailChangeCollection.insertOne(validProps);
  await execContract(confirmChangeEmail, { code: '123' }, 'user1_token');
  const user = await UserCollection.findByIdOrThrow(getId(1));
  expect(user.email).toEqual('foO@example.com');
  expect(user.email_lowered).toEqual('foo@example.com');
  expect(mocked_dispatchEvent).toBeCalled();
});

it('should return an error if confirmed multiple times', async () => {
  await ConfirmEmailChangeCollection.insertOne(validProps);
  await execContract(confirmChangeEmail, { code: '123' }, 'user1_token');
  await expect(
    execContract(confirmChangeEmail, { code: '123' }, 'user1_token')
  ).rejects.toThrow('You have already confirmed the new email.');
});
