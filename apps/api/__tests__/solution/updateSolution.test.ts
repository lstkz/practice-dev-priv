import { SolutionCollection } from '../../src/collections/Solution';
import {
  createSolutionVoteId,
  SolutionVoteCollection,
} from '../../src/collections/SolutionVote';
import { UserCollection } from '../../src/collections/User';
import { updateSolution } from '../../src/contracts/solution/updateSolution';
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
      score: 1,
      submissionId: getId(1000),
      title: 's1',
      userId: getId(1),
    },
  ]);
});

it('should throw if solution not found', async () => {
  await expect(
    execContract(
      updateSolution,
      {
        solutionId: getId(10000),
        values: {
          title: 'sol1',
        },
      },

      'user1_token'
    )
  ).rejects.toMatchInlineSnapshot(`[AppError: Solution not found]`);
});

it('should throw if no permission', async () => {
  await expect(
    execContract(
      updateSolution,
      {
        solutionId: getId(100),
        values: {
          title: 'sol1',
        },
      },

      'user2_token'
    )
  ).rejects.toMatchInlineSnapshot(`[Error: No access to solution]`);
});

it('should update a solution', async () => {
  await SolutionVoteCollection.insertMany([
    {
      _id: createSolutionVoteId({ userId: getId(1), solutionId: getId(100) }),
      score: 2,
      solutionId: getId(100),
      userId: getId(1),
    },
  ]);
  await expect(
    await execContract(
      updateSolution,
      {
        solutionId: getId(100),
        values: {
          title: 'sol1',
        },
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
              "slug": "challenge-2",
              "title": "challenge 2",
            },
            "createdAt": "1970-01-01T00:00:00.001Z",
            "id": "000000000000000000000100",
            "myScore": 2,
            "score": 1,
            "title": "sol1",
          }
        `);
});

it('should update a solution as admin', async () => {
  await UserCollection.findOneAndUpdate(
    {
      _id: getId(2),
    },
    {
      $set: {
        isAdmin: true,
      },
    }
  );
  await expect(
    await execContract(
      updateSolution,
      {
        solutionId: getId(100),
        values: {
          title: 'sol1',
        },
      },

      'user2_token'
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
              "slug": "challenge-2",
              "title": "challenge 2",
            },
            "createdAt": "1970-01-01T00:00:00.001Z",
            "id": "000000000000000000000100",
            "myScore": 0,
            "score": 1,
            "title": "sol1",
          }
        `);
});
