import { SolutionCollection } from '../../src/collections/Solution';
import { SolutionLimitCollection } from '../../src/collections/SolutionLimit';
import { UserCollection } from '../../src/collections/User';
import { deleteSolution } from '../../src/contracts/solution/deleteSolution';
import { execContract, getId, setupDb } from '../helper';
import { registerSampleUsers } from '../seed-data';

setupDb();

jest.mock('../../src/dispatch');

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
  await SolutionLimitCollection.insertMany([
    {
      _id: `${getId(1)}_1`,
      count: 1,
    },
  ]);
});

it('should throw if solution not found', async () => {
  await expect(
    execContract(
      deleteSolution,
      {
        solutionId: getId(10000),
      },

      'user1_token'
    )
  ).rejects.toMatchInlineSnapshot(`[AppError: Solution not found]`);
});

it('should throw if no permission', async () => {
  await expect(
    execContract(
      deleteSolution,
      {
        solutionId: getId(100),
      },

      'user2_token'
    )
  ).rejects.toMatchInlineSnapshot(`[Error: No access to solution]`);
});

it('should remove a solution', async () => {
  let solutionLimit = await SolutionLimitCollection.findOne({});
  expect(solutionLimit?.count).toBe(1);
  await execContract(
    deleteSolution,
    {
      solutionId: getId(100),
    },
    'user1_token'
  );
  expect(await SolutionCollection.countDocuments()).toBe(0);
  solutionLimit = await SolutionLimitCollection.findOne({});
  expect(solutionLimit?.count).toBe(0);
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
  await execContract(
    deleteSolution,
    {
      solutionId: getId(100),
    },
    'user1_token'
  );
  expect(await SolutionCollection.countDocuments()).toBe(0);
});
