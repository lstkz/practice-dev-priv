import { mocked } from 'ts-jest/utils';
import { execContract, getId, setupDb } from '../helper';
import { getEmail } from '../../src/common/google';
import { createUser } from '../../src/contracts/user/_common';
import { registerGoogle } from '../../src/contracts/user/registerGoogle';

jest.mock('../../src/common/google');
jest.mock('../../src/dispatch');

const mockedGetEmail = mocked(getEmail);

setupDb();

beforeAll(async () => {
  mockedGetEmail.mockImplementation(async () => 'user1@example.com');
});

it('should register successfully', async () => {
  const ret = await execContract(registerGoogle, { accessToken: 'abc' });
  ret.user.id = '';
  expect(ret.user).toMatchInlineSnapshot(`
Object {
  "avatarId": undefined,
  "email": "user1@example.com",
  "id": "",
  "isAdmin": undefined,
  "isVerified": true,
  "username": "user1",
}
`);
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
  await expect(
    execContract(registerGoogle, { accessToken: 'abc' })
  ).rejects.toThrowError('User is already registered');
});
