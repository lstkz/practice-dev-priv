import { UserCollection } from '../../src/collections/User';
import { getMe } from '../../src/contracts/user/getMe';
import { execContract, getId, setupDb } from '../helper';
import { registerSampleUsers } from '../seed-data';

setupDb();

beforeEach(async () => {
  await registerSampleUsers();
});

it('should return user', async () => {
  expect(await execContract(getMe, {}, 'user1_token')).toMatchInlineSnapshot(`
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

it('should update lastSeenAt if more than 1h', async () => {
  let user = await UserCollection.findByIdOrThrow(getId(1));
  user.lastSeenAt = new Date(2000, 0, 1, 10, 10);
  await UserCollection.update(user, ['lastSeenAt']);
  Date.now = () => new Date(2000, 0, 1, 11, 12).getTime();
  await execContract(getMe, {}, 'user1_token');
  user = await UserCollection.findByIdOrThrow(getId(1));
  expect(user.lastSeenAt).toEqual(new Date(2000, 0, 1, 11, 12));
});

it('should not update lastSeenAt if less than 1h', async () => {
  let user = await UserCollection.findByIdOrThrow(getId(1));
  user.lastSeenAt = new Date(2000, 0, 1, 10, 10);
  await UserCollection.update(user, ['lastSeenAt']);
  Date.now = () => new Date(2000, 0, 1, 10, 50).getTime();
  await execContract(getMe, {}, 'user1_token');
  user = await UserCollection.findByIdOrThrow(getId(1));
  expect(user.lastSeenAt).toEqual(new Date(2000, 0, 1, 10, 10));
});
