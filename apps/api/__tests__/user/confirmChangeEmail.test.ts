import { gql } from 'apollo-server';
import { mocked } from 'ts-jest/utils';
import { ConfirmEmailChangeCollection } from '../../src/collections/ConfirmEmailChange';
import * as DateFns from 'date-fns';
import { UserCollection } from '../../src/collections/User';
import { confirmChangeEmail } from '../../src/contracts/user/confirmChangeEmail';
import { dispatchEvent } from '../../src/dispatch';
import { apolloServer } from '../../src/server';
import { getAppUser, getId, getTokenOptions, setupDb } from '../helper';
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
  await expect(confirmChangeEmail(await getAppUser(1), '123')).rejects.toThrow(
    'Invalid code'
  );
});

it('should throw error if assigned for another user', async () => {
  await ConfirmEmailChangeCollection.insertOne({
    ...validProps,
    userId: getId(2),
  });
  await expect(confirmChangeEmail(await getAppUser(1), '123')).rejects.toThrow(
    'Invalid code'
  );
});

it('should throw error if email taken', async () => {
  await ConfirmEmailChangeCollection.insertOne({
    ...validProps,
    newEmail: 'user2@example.com',
  });
  await expect(confirmChangeEmail(await getAppUser(1), '123')).rejects.toThrow(
    'Cannot change email. Email taken by another user'
  );
});

it('should throw error if expired', async () => {
  await ConfirmEmailChangeCollection.insertOne({
    ...validProps,
    expireAt: new Date(1),
  });
  await expect(confirmChangeEmail(await getAppUser(1), '123')).rejects.toThrow(
    'Token expired. Please request email change again.'
  );
});

it('should change the email', async () => {
  await ConfirmEmailChangeCollection.insertOne(validProps);
  await confirmChangeEmail(await getAppUser(1), '123');
  const user = await UserCollection.findByIdOrThrow(getId(1));
  expect(user.email).toEqual('foO@example.com');
  expect(user.email_lowered).toEqual('foo@example.com');
  expect(mocked_dispatchEvent).toBeCalled();
});

it('should change the email #graphql', async () => {
  await ConfirmEmailChangeCollection.insertOne(validProps);
  const res = await apolloServer.executeOperation(
    {
      query: gql`
        mutation {
          confirmChangeEmail(code: "123")
        }
      `,
    },
    getTokenOptions('user1_token')
  );
  expect(res.errors).toBeFalsy();
});
