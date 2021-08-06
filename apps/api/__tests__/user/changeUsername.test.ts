import { UserCollection } from '../../src/collections/User';
import { changeUsername } from '../../src/contracts/user/changeUsername';
import { execContract, getId, setupDb } from '../helper';
import { registerSampleUsers } from '../seed-data';

setupDb();

beforeEach(async () => {
  await registerSampleUsers();
});

it('should throw if invalid username', async () => {
  await expect(
    execContract(changeUsername, { username: 'asd$5' }, 'user1_token')
  ).rejects.toMatchInlineSnapshot(
    `[Error: Validation error: 'username' must match regex /^[a-z\\d](?:[a-z\\d]|-(?=[a-z\\d])){0,30}$/i.]`
  );
});

it('should throw if duplicated', async () => {
  await expect(
    execContract(changeUsername, { username: 'User2' }, 'user1_token')
  ).rejects.toMatchInlineSnapshot(`[AppError: Username already taken]`);
});

it('should change the username', async () => {
  await execContract(changeUsername, { username: 'Foo' }, 'user1_token');
  const user = await UserCollection.findByIdOrThrow(getId(1));
  expect(user.username).toEqual('Foo');
  expect(user.username_lowered).toEqual('foo');
});

it('should change the username (different casing)', async () => {
  await execContract(changeUsername, { username: 'USER1' }, 'user1_token');
  const user = await UserCollection.findByIdOrThrow(getId(1));
  expect(user.username).toEqual('USER1');
  expect(user.username_lowered).toEqual('user1');
});
