import { gql } from 'apollo-server';
import { mocked } from 'ts-jest/utils';
import { exchangeCode, getUserData } from '../../src/common/github';
import { loginGithub } from '../../src/contracts/user/loginGithub';
import { createUser } from '../../src/contracts/user/_common';
import { apolloServer } from '../../src/server';
import { getId, setupDb } from '../helper';

jest.mock('../../src/common/github');

const mockedExchangeCode = mocked(exchangeCode);
const mockedGetUserData = mocked(getUserData);

setupDb();

beforeAll(async () => {
  mockedExchangeCode.mockImplementation(async () => '123');
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

  mockedGetUserData.mockImplementation(async () => ({
    email: 'new-user1@example.com',
    id: 123,
    username: 'git123',
  }));
  const res = await apolloServer.executeOperation({
    query: gql`
      mutation {
        loginGithub(code: "abc") {
          user {
            id
          }
        }
      }
    `,
  });
  expect(res.data).toMatchInlineSnapshot(`
Object {
  "loginGithub": Object {
    "user": Object {
      "id": "000000000000000000000001",
    },
  },
}
`);
});

it('should throw an error if not registered', async () => {
  mockedGetUserData.mockImplementation(async () => ({
    email: 'user1@example.com',
    id: 123,
    username: 'git123',
  }));
  await expect(loginGithub('abc')).rejects.toThrowError(
    'User is not registered'
  );
});
