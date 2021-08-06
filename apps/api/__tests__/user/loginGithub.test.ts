import { mocked } from 'ts-jest/utils';
import { exchangeCode, getUserData } from '../../src/common/github';
import { loginGithub } from '../../src/contracts/user/loginGithub';
import { createUser } from '../../src/contracts/user/_common';
import { execContract, getId, setupDb } from '../helper';

jest.mock('../../src/common/github');

const mockedExchangeCode = mocked(exchangeCode);
const mockedGetUserData = mocked(getUserData);

setupDb();

beforeAll(async () => {
  mockedExchangeCode.mockImplementation(async () => '123');
});

it('should login successfully', async () => {
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
  const ret = await execContract(loginGithub, { code: 'abc' });
  expect(ret.user).toMatchInlineSnapshot(`
Object {
  "avatarId": undefined,
  "email": "user1@example.com",
  "id": "000000000000000000000001",
  "isAdmin": undefined,
  "isVerified": true,
  "username": "user1",
}
`);
});

it('should throw an error if not registered', async () => {
  mockedGetUserData.mockImplementation(async () => ({
    email: 'user1@example.com',
    id: 123,
    username: 'git123',
  }));
  await expect(execContract(loginGithub, { code: 'abc' })).rejects.toThrowError(
    'User is not registered'
  );
});
