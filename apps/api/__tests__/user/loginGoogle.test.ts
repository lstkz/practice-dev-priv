import { mocked } from 'ts-jest/utils';
import { execContract, getId, setupDb } from '../helper';
import { getEmail } from '../../src/common/google';
import { loginGoogle } from '../../src/contracts/user/loginGoogle';
import { createUser } from '../../src/contracts/user/_common';

jest.mock('../../src/common/google');

const mockedGetEmail = mocked(getEmail);

setupDb();

beforeAll(async () => {
  mockedGetEmail.mockImplementation(async () => 'user1@example.com');
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
  const ret = await execContract(loginGoogle, { accessToken: 'abc' });
  expect(ret.user).toMatchInlineSnapshot(`
Object {
  "avatarId": undefined,
  "email": "user1@example.com",
  "hasNewsletter": false,
  "id": "000000000000000000000001",
  "isAdmin": undefined,
  "isVerified": true,
  "username": "user1",
}
`);
});

it('should throw an error if not registered', async () => {
  await expect(
    execContract(loginGoogle, { accessToken: 'abc' })
  ).rejects.toThrowError('User is not registered');
});
