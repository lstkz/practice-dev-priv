import { FollowerCollection } from '../../src/collections/Follower';
import { SolutionCollection } from '../../src/collections/Solution';
import { SubmissionCollection } from '../../src/collections/Submission';
import { UserCollection } from '../../src/collections/User';
import { getPublicProfile } from '../../src/contracts/user/getPublicProfile';
import { execContract, getId, setupDb } from '../helper';
import {
  getFollowerValues,
  getSampleSolutionValues,
  getSampleSubmissionValues,
  registerSampleUsers,
} from '../seed-data';

setupDb();

beforeEach(async () => {
  await registerSampleUsers();
  await SubmissionCollection.insertMany([
    getSampleSubmissionValues(100),
    getSampleSubmissionValues(200),
  ]);
  await SolutionCollection.insertMany([getSampleSolutionValues(10)]);
  await UserCollection.updateOne(
    {
      _id: getId(1),
    },
    {
      $set: {
        profile: {
          about: 'about field',
        },
      },
    }
  );
  await FollowerCollection.insertMany([
    getFollowerValues(1, 2),
    getFollowerValues(1, 3),
    getFollowerValues(4, 1),
  ]);
});

it('should throw if not found', async () => {
  await expect(
    execContract(
      getPublicProfile,
      {
        username: 'aaab',
      },

      'user1_token'
    )
  ).rejects.toMatchInlineSnapshot(`[AppError: User not found]`);
});

it('should return user1 (logged as user2)', async () => {
  expect(
    await execContract(
      getPublicProfile,
      {
        username: 'user1',
      },

      'user2_token'
    )
  ).toMatchInlineSnapshot(`
    Object {
      "about": "about field",
      "avatarId": undefined,
      "crypto": 0,
      "followers": 1,
      "following": 2,
      "id": "000000000000000000000001",
      "isFollowing": false,
      "lastSeen": "1970-01-01T00:00:00.002Z",
      "memberSince": "1970-01-01T00:00:00.001Z",
      "name": "",
      "rank": 0,
      "solutions": 1,
      "submissions": 2,
      "username": "user1",
    }
  `);
});

it('should return user2 (logged as user1)', async () => {
  expect(
    await execContract(
      getPublicProfile,
      {
        username: 'user2',
      },

      'user1_token'
    )
  ).toMatchInlineSnapshot(`
    Object {
      "about": "",
      "avatarId": undefined,
      "crypto": 0,
      "followers": 1,
      "following": 0,
      "id": "000000000000000000000002",
      "isFollowing": true,
      "lastSeen": "1970-01-01T00:00:00.020Z",
      "memberSince": "1970-01-01T00:00:00.010Z",
      "name": "",
      "rank": 0,
      "solutions": 0,
      "submissions": 0,
      "username": "user2",
    }
  `);
});

it('should return user1 (anonymous)', async () => {
  expect(
    await execContract(getPublicProfile, {
      username: 'user1',
    })
  ).toMatchInlineSnapshot(`
    Object {
      "about": "about field",
      "avatarId": undefined,
      "crypto": 0,
      "followers": 1,
      "following": 2,
      "id": "000000000000000000000001",
      "isFollowing": false,
      "lastSeen": "1970-01-01T00:00:00.002Z",
      "memberSince": "1970-01-01T00:00:00.001Z",
      "name": "",
      "rank": 0,
      "solutions": 1,
      "submissions": 2,
      "username": "user1",
    }
  `);
});
