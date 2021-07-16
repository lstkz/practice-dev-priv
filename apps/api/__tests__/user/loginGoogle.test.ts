import { mocked } from 'ts-jest/utils';
import { getId, setupDb } from '../helper';
import { getEmail } from '../../src/common/google';
import { apolloServer } from '../../src/server';
import { gql } from 'apollo-server';
import { loginGoogle } from '../../src/contracts/user/loginGoogle';
import { createUser } from '../../src/contracts/user/_common';

jest.mock('../../src/common/google');

const mockedGetEmail = mocked(getEmail);

setupDb();

beforeAll(async () => {
  mockedGetEmail.mockImplementation(async () => 'user1@example.com');
});

it('should login successfully #graphql', async () => {
  await createUser({
    userId: getId(1),
    email: 'user1@example.com',
    password: 'pass',
    githubId: 123,
    isVerified: true,
    username: 'user1',
  });
  const res = await apolloServer.executeOperation({
    query: gql`
      mutation {
        loginGoogle(accessToken: "abc") {
          user {
            id
          }
        }
      }
    `,
  });
  expect(res.data).toMatchInlineSnapshot(`
Object {
  "loginGoogle": Object {
    "user": Object {
      "id": "000000000000000000000001",
    },
  },
}
`);
});

it('should throw an error if not registered', async () => {
  await expect(loginGoogle('abc')).rejects.toThrowError(
    'User is not registered'
  );
});
