import { FollowerCollection } from '../../src/collections/Follower';
import { followUser } from '../../src/contracts/follower/followUser';
import { execContract, setupDb } from '../helper';
import { registerSampleUsers } from '../seed-data';

setupDb();

beforeEach(async () => {
  await registerSampleUsers();
  Date.now = () => 1;
});

it('should throw if user not found', async () => {
  await expect(
    execContract(
      followUser,
      {
        username: 'aaaa',
      },
      'user1_token'
    )
  ).rejects.toMatchInlineSnapshot(`[AppError: User not found]`);
});

it('should throw if user tries to follow yourself', async () => {
  await expect(
    execContract(
      followUser,
      {
        username: 'user1',
      },

      'user1_token'
    )
  ).rejects.toMatchInlineSnapshot(`[AppError: Cannot follow yourself]`);
});

it('should follow properly', async () => {
  await execContract(
    followUser,
    {
      username: 'user2',
    },
    'user1_token'
  );

  expect(await FollowerCollection.findOne({})).toMatchInlineSnapshot(`
    Object {
      "_id": "000000000000000000000002_000000000000000000000001",
      "createdAt": 1970-01-01T00:00:00.001Z,
      "fromUserId": "000000000000000000000001",
      "targetUserId": "000000000000000000000002",
    }
  `);
});

it('should throw if already following properly', async () => {
  await execContract(
    followUser,
    {
      username: 'user2',
    },
    'user1_token'
  );
  await expect(
    execContract(
      followUser,
      {
        username: 'user2',
      },

      'user1_token'
    )
  ).rejects.toMatchInlineSnapshot(`[AppError: Already following]`);
});
