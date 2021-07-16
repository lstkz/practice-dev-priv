import { mocked } from 'ts-jest/utils';
import { getId, setupDb } from '../helper';
import { getEmail } from '../../src/common/google';
import { createUser } from '../../src/contracts/user/_common';
import { registerGoogle } from '../../src/contracts/user/registerGoogle';
import { gql } from 'apollo-server';
import { apolloServer } from '../../src/server';

jest.mock('../../src/common/google');
jest.mock('../../src/dispatch');

const mockedGetEmail = mocked(getEmail);

setupDb();

beforeAll(async () => {
  mockedGetEmail.mockImplementation(async () => 'user1@example.com');
});

it('should register successfully #graphql', async () => {
  const res = await apolloServer.executeOperation({
    query: gql`
      mutation {
        registerGoogle(accessToken: "abc") {
          user {
            email
            username
          }
        }
      }
    `,
  });
  expect(res.data).toMatchInlineSnapshot(`
Object {
  "registerGoogle": Object {
    "user": Object {
      "email": "user1@example.com",
      "username": "user1",
    },
  },
}
`);
  expect(res.errors).toBeFalsy();
});

it('should throw an error if already registered code', async () => {
  await createUser({
    email: 'user1@example.com',
    isVerified: true,
    password: 'a',
    githubId: 123,
    userId: getId(1),
    username: 'user1',
  });
  await expect(registerGoogle('abc')).rejects.toThrowError(
    'User is already registered'
  );
});
