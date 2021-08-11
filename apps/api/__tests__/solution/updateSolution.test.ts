import { SolutionCollection } from '../../src/collections/Solution';
import { UserCollection } from '../../src/collections/User';
import { updateSolution } from '../../src/contracts/solution/updateSolution';
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
            "createdAt": "1970-01-01T00:00:00.001Z",
            "id": "000000000000000000000100",
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
            "createdAt": "1970-01-01T00:00:00.001Z",
            "id": "000000000000000000000100",
            "score": 1,
            "title": "sol1",
          }
        `);
});
