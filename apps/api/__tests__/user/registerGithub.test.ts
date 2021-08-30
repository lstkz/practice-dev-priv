import { ObjectID } from 'mongodb2';
import { mocked } from 'ts-jest/utils';
import { UserCollection } from '../../src/collections/User';
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
    avatar_url: '',
    bio: 'bio',
    blog: 'http://url',
    location: 'Poland',
    name: 'User1',
  }));
});

it('should register successfully', async () => {
  const ret = await execContract(registerGithub, { code: 'abc' });
  expect(ret.user).toMatchInlineSnapshot(`
Object {
  "avatarId": undefined,
  "email": "new-user1@example.com",
  "hasNewsletter": false,
  "id": <Random ObjectID>,
  "isAdmin": undefined,
  "isVerified": true,
  "username": "git123",
}
`);
  const user = await UserCollection.findById(
    ObjectID.createFromHexString(ret.user.id)
  );
  expect(user?.profile).toMatchInlineSnapshot(`
Object {
  "about": "bio",
  "country": "PL",
  "name": "User1",
  "url": "http://url",
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
