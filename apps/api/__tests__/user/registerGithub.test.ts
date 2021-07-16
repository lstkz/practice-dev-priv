import { gql } from 'apollo-server';
import { mocked } from 'ts-jest/utils';
import { exchangeCode, getUserData } from '../../src/common/github';
import { registerGithub } from '../../src/contracts/user/registerGithub';
import { createUser } from '../../src/contracts/user/_common';
import { apolloServer } from '../../src/server';
import { getId, setupDb } from '../helper';

jest.mock('../../src/dispatch');
jest.mock('../../src/common/github');

const mockedExchangeCode = mocked(exchangeCode);
const mockedGetUserData = mocked(getUserData);

setupDb();

beforeAll(async () => {
  mockedExchangeCode.mockImplementation(async () => '123');
  mockedGetUserData.mockImplementation(async () => ({
    email: 'new-user1@example.com',
    id: 123,
    username: 'git123',
  }));
});

it('should register successfully #graphql', async () => {
  const res = await apolloServer.executeOperation({
    query: gql`
      mutation {
        registerGithub(code: "abc") {
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
  "registerGithub": Object {
    "user": Object {
      "email": "new-user1@example.com",
      "username": "git123",
    },
  },
}
`);
  expect(res.errors).toBeFalsy();
});

it('should throw an error if already registered code', async () => {
  await createUser({
    email: 'aa',
    isVerified: true,
    password: 'a',
    githubId: 123,
    userId: getId(1),
    username: 'user1',
  });
  await expect(registerGithub('abc')).rejects.toThrowError(
    'User is already registered'
  );
});
