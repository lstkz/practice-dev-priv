import { gql } from 'apollo-server';
import { apolloServer } from '../../src/server';
import { getTokenOptions, setupDb } from '../helper';
import { registerSampleUsers } from '../seed-data';

setupDb();

beforeEach(async () => {
  await registerSampleUsers();
});

it('reset password successfully', async () => {
  const { user, token } = await login({
    usernameOrEmail: 'user1@example.org',
    password: 'pass123',
  });
  expect(token).toBeDefined();
  expect(user.id).toBeDefined();
  expect(user.isVerified).toEqual(true);
  expect(user.email).toEqual('user1@example.org');
  expect(user.username).toEqual('TomTom');
});
