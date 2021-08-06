import { execContract, getId, setupDb } from '../helper';
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
  await execContract(deleteAvatar, {}, 'user1_token');
  user = await UserCollection.findByIdOrThrow(getId(1));
  expect(user.avatarId).toBeFalsy();
});
