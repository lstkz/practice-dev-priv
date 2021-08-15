import { SolutionCollection } from '../../src/collections/Solution';
import { voteSolution } from '../../src/contracts/solution/voteSolution';
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
      score: 0,
      submissionId: getId(1000),
      title: 's1',
      userId: getId(1),
    },
  ]);
});

it('should throw if solution not found', async () => {
  await expect(
    execContract(
      voteSolution,
      {
        solutionId: getId(1000),
        vote: 'up',
      },

      'user1_token'
    )
  ).rejects.toMatchInlineSnapshot(`[AppError: Solution not found]`);
});

it('should vote up 1 time', async () => {
  const ret = await execContract(
    voteSolution,
    {
      solutionId: getId(100),
      vote: 'up',
    },

    'user1_token'
  );
  expect(ret.score).toEqual(1);
  expect(ret.myScore).toEqual(1);
  const solution = await SolutionCollection.findOne({});
  expect(solution?.score).toEqual(1);
});

it('should vote up 1 time (base score 10)', async () => {
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
  const ret = await execContract(
    voteSolution,
    {
      solutionId: getId(100),
      vote: 'up',
    },

    'user1_token'
  );
  expect(ret.score).toEqual(11);
  expect(ret.myScore).toEqual(1);
  const solution = await SolutionCollection.findOne({});
  expect(solution?.score).toEqual(11);
});

it('should vote up 1 down', async () => {
  const ret = await execContract(
    voteSolution,
    {
      solutionId: getId(100),
      vote: 'down',
    },

    'user1_token'
  );
  expect(ret.score).toEqual(-1);
  expect(ret.myScore).toEqual(-1);
  const solution = await SolutionCollection.findOne({});
  expect(solution?.score).toEqual(-1);
});

it('should vote up 3 times', async () => {
  const exec = () =>
    execContract(
      voteSolution,
      {
        solutionId: getId(100),
        vote: 'up',
      },

      'user1_token'
    );
  const ret = await Promise.all([exec(), exec(), exec(), exec()]);
  expect(ret).toHaveLength(4);
  ret.forEach(data => {
    expect(data.score).toBeLessThanOrEqual(3);
  });
  const solution = await SolutionCollection.findOne({});
  expect(solution?.score).toEqual(3);
});

it('should handle mixed votes', async () => {
  const exec = (vote: 'up' | 'down') =>
    execContract(
      voteSolution,
      {
        solutionId: getId(100),
        vote,
      },

      'user1_token'
    );
  await Promise.all([exec('up'), exec('down'), exec('up')]);
  const solution = await SolutionCollection.findOne({});
  expect(solution?.score).toEqual(1);
});
