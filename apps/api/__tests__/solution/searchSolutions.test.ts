import { SolutionSortBy } from 'shared';
import { SolutionCollection } from '../../src/collections/Solution';
import {
  createSolutionVoteId,
  SolutionVoteCollection,
} from '../../src/collections/SolutionVote';
import { searchSolutions } from '../../src/contracts/solution/searchSolutions';
import { execContract, getId, setupDb } from '../helper';
import { registerSampleUsers } from '../seed-data';

setupDb();

beforeEach(async () => {
  await registerSampleUsers();
  await SolutionCollection.insertMany([
    {
      _id: getId(100),
      challengeId: '1',
      createdAt: new Date(1),
      score: 1,
      submissionId: getId(1000),
      title: 's1',
      userId: getId(1),
    },
    {
      _id: getId(101),
      challengeId: '1',
      createdAt: new Date(2),
      score: 2,
      submissionId: getId(1000),
      title: 's2',
      userId: getId(1),
    },
    {
      _id: getId(102),
      challengeId: '1',
      createdAt: new Date(3),
      score: 10,
      submissionId: getId(1000),
      title: 's3',
      userId: getId(1),
    },
    {
      _id: getId(103),
      challengeId: '1',
      createdAt: new Date(4),
      score: 5,
      submissionId: getId(1000),
      title: 's4',
      userId: getId(1),
    },
    {
      _id: getId(104),
      challengeId: '2',
      createdAt: new Date(4),
      score: 5,
      submissionId: getId(1000),
      title: 's5',
      userId: getId(1),
    },
  ]);
});

it('should return results by newest', async () => {
  expect(
    await execContract(
      searchSolutions,
      {
        criteria: {
          offset: 0,
          limit: 10,
          sortBy: SolutionSortBy.Newest,
          challengeId: '1',
        },
      },

      'user1_token'
    )
  ).toMatchInlineSnapshot(`
    Object {
      "items": Array [
        Object {
          "author": Object {
            "avatarId": undefined,
            "id": "000000000000000000000001",
            "username": "user1",
          },
          "createdAt": "1970-01-01T00:00:00.004Z",
          "id": "000000000000000000000103",
          "myScore": 0,
          "score": 5,
          "title": "s4",
        },
        Object {
          "author": Object {
            "avatarId": undefined,
            "id": "000000000000000000000001",
            "username": "user1",
          },
          "createdAt": "1970-01-01T00:00:00.003Z",
          "id": "000000000000000000000102",
          "myScore": 0,
          "score": 10,
          "title": "s3",
        },
        Object {
          "author": Object {
            "avatarId": undefined,
            "id": "000000000000000000000001",
            "username": "user1",
          },
          "createdAt": "1970-01-01T00:00:00.002Z",
          "id": "000000000000000000000101",
          "myScore": 0,
          "score": 2,
          "title": "s2",
        },
        Object {
          "author": Object {
            "avatarId": undefined,
            "id": "000000000000000000000001",
            "username": "user1",
          },
          "createdAt": "1970-01-01T00:00:00.001Z",
          "id": "000000000000000000000100",
          "myScore": 0,
          "score": 1,
          "title": "s1",
        },
      ],
      "total": 4,
    }
  `);
});

it('should return results by oldest', async () => {
  expect(
    await execContract(
      searchSolutions,
      {
        criteria: {
          offset: 0,
          limit: 10,
          sortBy: SolutionSortBy.Oldest,
          challengeId: '1',
        },
      },

      'user1_token'
    )
  ).toMatchInlineSnapshot(`
    Object {
      "items": Array [
        Object {
          "author": Object {
            "avatarId": undefined,
            "id": "000000000000000000000001",
            "username": "user1",
          },
          "createdAt": "1970-01-01T00:00:00.001Z",
          "id": "000000000000000000000100",
          "myScore": 0,
          "score": 1,
          "title": "s1",
        },
        Object {
          "author": Object {
            "avatarId": undefined,
            "id": "000000000000000000000001",
            "username": "user1",
          },
          "createdAt": "1970-01-01T00:00:00.002Z",
          "id": "000000000000000000000101",
          "myScore": 0,
          "score": 2,
          "title": "s2",
        },
        Object {
          "author": Object {
            "avatarId": undefined,
            "id": "000000000000000000000001",
            "username": "user1",
          },
          "createdAt": "1970-01-01T00:00:00.003Z",
          "id": "000000000000000000000102",
          "myScore": 0,
          "score": 10,
          "title": "s3",
        },
        Object {
          "author": Object {
            "avatarId": undefined,
            "id": "000000000000000000000001",
            "username": "user1",
          },
          "createdAt": "1970-01-01T00:00:00.004Z",
          "id": "000000000000000000000103",
          "myScore": 0,
          "score": 5,
          "title": "s4",
        },
      ],
      "total": 4,
    }
  `);
});

it('should return results by best', async () => {
  expect(
    await execContract(
      searchSolutions,
      {
        criteria: {
          offset: 0,
          limit: 10,
          sortBy: SolutionSortBy.Best,
          challengeId: '1',
        },
      },

      'user1_token'
    )
  ).toMatchInlineSnapshot(`
    Object {
      "items": Array [
        Object {
          "author": Object {
            "avatarId": undefined,
            "id": "000000000000000000000001",
            "username": "user1",
          },
          "createdAt": "1970-01-01T00:00:00.003Z",
          "id": "000000000000000000000102",
          "myScore": 0,
          "score": 10,
          "title": "s3",
        },
        Object {
          "author": Object {
            "avatarId": undefined,
            "id": "000000000000000000000001",
            "username": "user1",
          },
          "createdAt": "1970-01-01T00:00:00.004Z",
          "id": "000000000000000000000103",
          "myScore": 0,
          "score": 5,
          "title": "s4",
        },
        Object {
          "author": Object {
            "avatarId": undefined,
            "id": "000000000000000000000001",
            "username": "user1",
          },
          "createdAt": "1970-01-01T00:00:00.002Z",
          "id": "000000000000000000000101",
          "myScore": 0,
          "score": 2,
          "title": "s2",
        },
        Object {
          "author": Object {
            "avatarId": undefined,
            "id": "000000000000000000000001",
            "username": "user1",
          },
          "createdAt": "1970-01-01T00:00:00.001Z",
          "id": "000000000000000000000100",
          "myScore": 0,
          "score": 1,
          "title": "s1",
        },
      ],
      "total": 4,
    }
  `);
});

it('should return results by oldest with offset', async () => {
  expect(
    await execContract(
      searchSolutions,
      {
        criteria: {
          offset: 1,
          limit: 10,
          sortBy: SolutionSortBy.Oldest,
          challengeId: '1',
        },
      },

      'user1_token'
    )
  ).toMatchInlineSnapshot(`
    Object {
      "items": Array [
        Object {
          "author": Object {
            "avatarId": undefined,
            "id": "000000000000000000000001",
            "username": "user1",
          },
          "createdAt": "1970-01-01T00:00:00.002Z",
          "id": "000000000000000000000101",
          "myScore": 0,
          "score": 2,
          "title": "s2",
        },
        Object {
          "author": Object {
            "avatarId": undefined,
            "id": "000000000000000000000001",
            "username": "user1",
          },
          "createdAt": "1970-01-01T00:00:00.003Z",
          "id": "000000000000000000000102",
          "myScore": 0,
          "score": 10,
          "title": "s3",
        },
        Object {
          "author": Object {
            "avatarId": undefined,
            "id": "000000000000000000000001",
            "username": "user1",
          },
          "createdAt": "1970-01-01T00:00:00.004Z",
          "id": "000000000000000000000103",
          "myScore": 0,
          "score": 5,
          "title": "s4",
        },
      ],
      "total": 4,
    }
  `);
});

it('should return results by oldest with limit', async () => {
  expect(
    await execContract(
      searchSolutions,
      {
        criteria: {
          offset: 0,
          limit: 2,
          sortBy: SolutionSortBy.Oldest,
          challengeId: '1',
        },
      },

      'user1_token'
    )
  ).toMatchInlineSnapshot(`
    Object {
      "items": Array [
        Object {
          "author": Object {
            "avatarId": undefined,
            "id": "000000000000000000000001",
            "username": "user1",
          },
          "createdAt": "1970-01-01T00:00:00.001Z",
          "id": "000000000000000000000100",
          "myScore": 0,
          "score": 1,
          "title": "s1",
        },
        Object {
          "author": Object {
            "avatarId": undefined,
            "id": "000000000000000000000001",
            "username": "user1",
          },
          "createdAt": "1970-01-01T00:00:00.002Z",
          "id": "000000000000000000000101",
          "myScore": 0,
          "score": 2,
          "title": "s2",
        },
      ],
      "total": 4,
    }
  `);
});

it('should return results with myScore', async () => {
  await SolutionCollection.findOneAndUpdate(
    {
      _id: getId(100),
    },
    {
      $set: {
        score: 10,
      },
    }
  );
  await SolutionVoteCollection.insertMany([
    {
      _id: createSolutionVoteId({ userId: getId(1), solutionId: getId(100) }),
      score: 2,
      solutionId: getId(100),
      userId: getId(1),
    },
    {
      _id: createSolutionVoteId({ userId: getId(2), solutionId: getId(100) }),
      score: 1,
      solutionId: getId(101),
      userId: getId(2),
    },
  ]);
  expect(
    await execContract(
      searchSolutions,
      {
        criteria: {
          offset: 0,
          limit: 2,
          sortBy: SolutionSortBy.Oldest,
          challengeId: '1',
        },
      },

      'user1_token'
    )
  ).toMatchInlineSnapshot(`
    Object {
      "items": Array [
        Object {
          "author": Object {
            "avatarId": undefined,
            "id": "000000000000000000000001",
            "username": "user1",
          },
          "createdAt": "1970-01-01T00:00:00.001Z",
          "id": "000000000000000000000100",
          "myScore": 2,
          "score": 10,
          "title": "s1",
        },
        Object {
          "author": Object {
            "avatarId": undefined,
            "id": "000000000000000000000001",
            "username": "user1",
          },
          "createdAt": "1970-01-01T00:00:00.002Z",
          "id": "000000000000000000000101",
          "myScore": 0,
          "score": 2,
          "title": "s2",
        },
      ],
      "total": 4,
    }
  `);
});

it('should should as anonymous', async () => {
  expect(
    await execContract(searchSolutions, {
      criteria: {
        offset: 0,
        limit: 2,
        sortBy: SolutionSortBy.Oldest,
        challengeId: '1',
      },
    })
  ).toMatchInlineSnapshot(`
    Object {
      "items": Array [
        Object {
          "author": Object {
            "avatarId": undefined,
            "id": "000000000000000000000001",
            "username": "user1",
          },
          "createdAt": "1970-01-01T00:00:00.001Z",
          "id": "000000000000000000000100",
          "myScore": 0,
          "score": 1,
          "title": "s1",
        },
        Object {
          "author": Object {
            "avatarId": undefined,
            "id": "000000000000000000000001",
            "username": "user1",
          },
          "createdAt": "1970-01-01T00:00:00.002Z",
          "id": "000000000000000000000101",
          "myScore": 0,
          "score": 2,
          "title": "s2",
        },
      ],
      "total": 4,
    }
  `);
});
