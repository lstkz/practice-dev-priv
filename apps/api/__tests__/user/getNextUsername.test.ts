import * as R from 'remeda';
import { UserCollection, UserModel } from '../../src/collections/User';
import { getNextUsername } from '../../src/contracts/user/_common';
import { setupDb } from '../helper';

function _createUser(username: string) {
  const user: UserModel = {
    _id: undefined!,
    email: username,
    email_lowered: username.toLowerCase(),
    username: username,
    username_lowered: username.toLowerCase(),
    salt: '',
    password: '',
    isVerified: true,
  };
  return user;
}

setupDb();

it('should return original username', async () => {
  const ret = await getNextUsername('john');
  expect(ret).toEqual('john');
});

it('should return original 2nd username', async () => {
  await UserCollection.insertOne(_createUser('john'));
  const ret = await getNextUsername('john');
  expect(ret).toEqual('john2');
});

it('should return original 15th username', async () => {
  const users: UserModel[] = [
    _createUser('john'),
    ...R.range(2, 15).map(nr => _createUser('john' + nr)),
  ];
  await UserCollection.insertMany(users);
  const ret = await getNextUsername('john');
  expect(ret).toEqual('john15');
});

it('should return a random username', async () => {
  const users: UserModel[] = [
    _createUser('john'),
    ...R.range(2, 50).map(nr => _createUser('john' + nr)),
  ];
  await UserCollection.insertMany(users);
  const ret = await getNextUsername('john');
  expect(/^user\d+$/.test(ret)).toBe(true);
});
