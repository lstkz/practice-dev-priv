import { FollowerCollection } from '../../src/collections/Follower';
import { unfollowUser } from '../../src/contracts/follower/unfollowUser';
import { execContract, setupDb } from '../helper';
import { getFollowerValues, registerSampleUsers } from '../seed-data';

setupDb();

beforeEach(async () => {
  await registerSampleUsers();
  Date.now = () => 1;
  await FollowerCollection.insertMany([getFollowerValues(1, 2)]);
});

it('should throw if user not found', async () => {
  await expect(
    execContract(
      unfollowUser,
      {
        username: 'aaaa',
      },
      'user1_token'
    )
  ).rejects.toMatchInlineSnapshot(`[AppError: User not found]`);
});

it('should throw if user tries to unfollow yourself', async () => {
  await expect(
    execContract(
      unfollowUser,
      {
        username: 'user1',
      },

      'user1_token'
    )
  ).rejects.toMatchInlineSnapshot(`[AppError: Cannot unfollow yourself]`);
});

it('should throw if not following', async () => {
  await expect(
    execContract(
      unfollowUser,
      {
        username: 'user1',
      },

      'user2_token'
    )
  ).rejects.toMatchInlineSnapshot(`[AppError: Not following]`);
});

it('should unfollow properly', async () => {
  await execContract(
    unfollowUser,
    {
      username: 'user2',
    },
    'user1_token'
  );

  expect(await FollowerCollection.findOne({})).toBeFalsy();
});
