import { SolutionCollection } from '../../src/collections/Solution';
import {
  createSolutionVoteId,
  SolutionVoteCollection,
} from '../../src/collections/SolutionVote';
import { getSolution } from '../../src/contracts/solution/getSolution';
import { execContract, getId, setupDb } from '../helper';
import { createSampleChallenges, registerSampleUsers } from '../seed-data';

setupDb();

beforeEach(async () => {
  await registerSampleUsers();
  await createSampleChallenges();
  await SolutionCollection.insertMany([
    {
      _id: getId(100),
      challengeId: '1_2',
      createdAt: new Date(1),
      score: 3,
      submissionId: getId(1000),
      title: 's1',
      userId: getId(1),
    },
  ]);
  await SolutionVoteCollection.insertMany([
    {
      _id: createSolutionVoteId({ userId: getId(1), solutionId: getId(100) }),
      score: 2,
      solutionId: getId(100),
      userId: getId(1),
    },
  ]);
});

it('should throw if solution not found', async () => {
  await expect(
    execContract(
      getSolution,
      {
        id: getId(10000),
      },

      'user1_token'
    )
  ).rejects.toMatchInlineSnapshot(`[AppError: Solution not found]`);
});

it('should return a solution', async () => {
  expect(
    await execContract(
      getSolution,
      {
        id: getId(100),
      },

      'user1_token'
    )
  ).toMatchInlineSnapshot(`
    Object {
      "author": Object {
        "avatarId": undefined,
        "id": "000000000000000000000001",
        "username": "user1",
      },
      "challenge": Object {
        "id": "1_2",
        "title": "challenge 2",
      },
      "createdAt": "1970-01-01T00:00:00.001Z",
      "id": "000000000000000000000100",
      "myScore": 2,
      "score": 3,
      "title": "s1",
    }
  `);
});

it('should return a solution as anonymous', async () => {
  expect(
    await execContract(getSolution, {
      id: getId(100),
    })
  ).toMatchInlineSnapshot(`
    Object {
      "author": Object {
        "avatarId": undefined,
        "id": "000000000000000000000001",
        "username": "user1",
      },
      "challenge": Object {
        "id": "1_2",
        "title": "challenge 2",
      },
      "createdAt": "1970-01-01T00:00:00.001Z",
      "id": "000000000000000000000100",
      "myScore": 0,
      "score": 3,
      "title": "s1",
    }
  `);
});
