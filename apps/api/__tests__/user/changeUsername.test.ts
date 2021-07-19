import { gql } from 'apollo-server';
import { UserCollection } from '../../src/collections/User';
import { changeUsername } from '../../src/contracts/user/changeUsername';
import { apolloServer } from '../../src/server';
import { getAppUser, getId, getTokenOptions, setupDb } from '../helper';
import { registerSampleUsers } from '../seed-data';

setupDb();

beforeEach(async () => {
  await registerSampleUsers();
});

it('should throw if invalid username', async () => {
  await expect(
    changeUsername(await getAppUser(1), 'asd$5')
  ).rejects.toMatchInlineSnapshot(
    `[Error: Validation error: 'username' must match regex /^[a-z\\d](?:[a-z\\d]|-(?=[a-z\\d])){0,30}$/i.]`
  );
});

it('should throw if duplicated', async () => {
  await expect(
    changeUsername(await getAppUser(1), 'User2')
  ).rejects.toMatchInlineSnapshot(`[AppError: Username already taken]`);
});

it('should change the username', async () => {
  await changeUsername(await getAppUser(1), 'Foo');
  const user = await UserCollection.findByIdOrThrow(getId(1));
  expect(user.username).toEqual('Foo');
  expect(user.username_lowered).toEqual('foo');
});

it('should change the username #graphql', async () => {
  const res = await apolloServer.executeOperation(
    {
      query: gql`
        mutation {
          changeUsername(username: "Foo")
        }
      `,
    },
    getTokenOptions('user1_token')
  );
  expect(res.errors).toBeFalsy();
});
