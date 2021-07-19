import { gql } from 'apollo-server';
import { UserCollection } from '../../src/collections/User';
import { changePassword } from '../../src/contracts/user/changePassword';
import { apolloServer } from '../../src/server';
import { getAppUser, getId, getTokenOptions, setupDb } from '../helper';
import { registerSampleUsers } from '../seed-data';

setupDb();

beforeEach(async () => {
  await registerSampleUsers();
});

it('should throw if invalid email', async () => {
  await expect(
    changePassword(await getAppUser(1), '12')
  ).rejects.toMatchInlineSnapshot(
    `[Error: Validation error: 'password' length must be at least 5 characters long.]`
  );
});

it('should change the password', async () => {
  const user1 = await UserCollection.findByIdOrThrow(getId(1));
  await changePassword(await getAppUser(1), '123456');
  const user2 = await UserCollection.findByIdOrThrow(getId(1));
  expect(user1.password).not.toEqual(user2);
});

it('should change the password #graphql', async () => {
  const res = await apolloServer.executeOperation(
    {
      query: gql`
        mutation {
          changePassword(password: "123qwe")
        }
      `,
    },
    getTokenOptions('user1_token')
  );
  expect(res.errors).toBeFalsy();
});
