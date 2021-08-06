import { mocked } from 'ts-jest/utils';
import { exchangeCode, getUserData } from '../../src/common/github';
import { registerGithub } from '../../src/contracts/user/registerGithub';
import { createUser } from '../../src/contracts/user/_common';
import { execContract, getId, setupDb } from '../helper';

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

it('should register successfully', async () => {
  const ret = await execContract(registerGithub, { code: 'abc' });
  ret.user.id = '';
  expect(ret.user).toMatchInlineSnapshot(`
Object {
  "avatarId": undefined,
  "email": "new-user1@example.com",
  "id": "",
  "isAdmin": undefined,
  "isVerified": true,
  "username": "git123",
}
`);
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
  await expect(
    execContract(registerGithub, { code: 'abc' })
  ).rejects.toThrowError('User is already registered');
});
