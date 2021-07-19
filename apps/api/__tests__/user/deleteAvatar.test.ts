import { gql } from 'apollo-server';
import { apolloServer } from '../../src/server';
import { getAppUser, getId, getTokenOptions, setupDb } from '../helper';
import { registerSampleUsers } from '../seed-data';
import { UserCollection } from '../../src/collections/User';
import { deleteAvatar } from '../../src/contracts/user/deleteAvatar';

setupDb();

beforeEach(async () => {
  await registerSampleUsers();
  await UserCollection.updateOne(
    {
      _id: getId(1),
    },
    {
      $set: {
        avatarId: '123',
      },
    }
  );
});

it('should delete avatar', async () => {
  let user = await UserCollection.findByIdOrThrow(getId(1));
  expect(user.avatarId).toBeTruthy();
  await deleteAvatar(await getAppUser(1));
  user = await UserCollection.findByIdOrThrow(getId(1));
  expect(user.avatarId).toBeFalsy();
});

it('should delete avatar #graphql', async () => {
  const res = await apolloServer.executeOperation(
    {
      query: gql`
        mutation {
          deleteAvatar
        }
      `,
    },
    getTokenOptions('user1_token')
  );
  expect(res.errors).toBeFalsy();
});
