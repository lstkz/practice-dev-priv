import { searchFollowers } from '../../src/contracts/follower/searchFollowers';
import { execContract, setupDb } from '../helper';
import { createUser } from '../../src/contracts/user/_common';
import {
  getFollowerValues,
  getUserValues,
  registerSampleUsers,
} from '../seed-data';
import { FollowerCollection } from '../../src/collections/Follower';

setupDb();

beforeEach(async () => {
  await registerSampleUsers();
  await Promise.all([
    createUser(getUserValues(3)),
    createUser(getUserValues(4)),
    createUser(getUserValues(5)),
  ]);
  await FollowerCollection.insertMany([
    getFollowerValues(2, 1, {
      createdAt: new Date(1),
    }),
    getFollowerValues(3, 1, {
      createdAt: new Date(2),
    }),
    getFollowerValues(4, 1, {
      createdAt: new Date(3),
    }),
    getFollowerValues(4, 2, {
      createdAt: new Date(4),
    }),
    getFollowerValues(2, 3, {
      createdAt: new Date(5),
    }),
  ]);
});

it('should return followers for user1 as user2', async () => {
  expect(
    await execContract(
      searchFollowers,
      {
        criteria: {
          offset: 0,
          limit: 10,
          username: 'user1',
        },
      },

      'user2_token'
    )
  ).toMatchInlineSnapshot(`
    Object {
      "items": Array [
        Object {
          "avatarId": undefined,
          "id": "000000000000000000000004",
          "isFollowing": false,
          "name": "",
          "username": "user4",
        },
        Object {
          "avatarId": undefined,
          "id": "000000000000000000000003",
          "isFollowing": true,
          "name": "",
          "username": "user3",
        },
        Object {
          "avatarId": undefined,
          "id": "000000000000000000000002",
          "isFollowing": false,
          "name": "",
          "username": "user2",
        },
      ],
      "total": 3,
    }
  `);
});

it('should return followers for user1 as user1', async () => {
  expect(
    await execContract(
      searchFollowers,
      {
        criteria: {
          offset: 0,
          limit: 10,
          username: 'user1',
        },
      },

      'user1_token'
    )
  ).toMatchInlineSnapshot(`
    Object {
      "items": Array [
        Object {
          "avatarId": undefined,
          "id": "000000000000000000000004",
          "isFollowing": false,
          "name": "",
          "username": "user4",
        },
        Object {
          "avatarId": undefined,
          "id": "000000000000000000000003",
          "isFollowing": false,
          "name": "",
          "username": "user3",
        },
        Object {
          "avatarId": undefined,
          "id": "000000000000000000000002",
          "isFollowing": false,
          "name": "",
          "username": "user2",
        },
      ],
      "total": 3,
    }
  `);
});

it('should return followers for user1 as anonymous', async () => {
  expect(
    await execContract(searchFollowers, {
      criteria: {
        offset: 0,
        limit: 10,
        username: 'user1',
      },
    })
  ).toMatchInlineSnapshot(`
    Object {
      "items": Array [
        Object {
          "avatarId": undefined,
          "id": "000000000000000000000004",
          "isFollowing": false,
          "name": "",
          "username": "user4",
        },
        Object {
          "avatarId": undefined,
          "id": "000000000000000000000003",
          "isFollowing": false,
          "name": "",
          "username": "user3",
        },
        Object {
          "avatarId": undefined,
          "id": "000000000000000000000002",
          "isFollowing": false,
          "name": "",
          "username": "user2",
        },
      ],
      "total": 3,
    }
  `);
});
