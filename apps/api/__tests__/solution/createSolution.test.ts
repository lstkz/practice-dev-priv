import { createSolution } from '../../src/contracts/solution/createSolution';
import { execContract, getId, setupDb } from '../helper';
import {
  createSampleChallenges,
  createSampleSubmissions,
  registerSampleUsers,
} from '../seed-data';

setupDb();

beforeEach(async () => {
  await registerSampleUsers();
  await createSampleChallenges();
  await createSampleSubmissions();
});

it('should throw if submission not found', async () => {
  await expect(
    execContract(
      createSolution,
      {
        values: {
          submissionId: getId(1001),
          title: 'sol1',
        },
      },

      'user1_token'
    )
  ).rejects.toMatchInlineSnapshot(`[AppError: Submission not found]`);
});

it('should throw if no access to submission', async () => {
  await expect(
    execContract(
      createSolution,
      {
        values: {
          submissionId: getId(100),
          title: 'sol1',
        },
      },

      'user2_token'
    )
  ).rejects.toMatchInlineSnapshot(`[Error: No access to submission]`);
});

it('should throw if submission is not passed', async () => {
  await expect(
    execContract(
      createSolution,
      {
        values: {
          submissionId: getId(101),
          title: 'sol1',
        },
      },

      'user1_token'
    )
  ).rejects.toMatchInlineSnapshot(
    `[AppError: You can only create a solution from a passing submission.]`
  );
});

it('should create a solution', async () => {
  expect(
    await execContract(
      createSolution,
      {
        values: {
          submissionId: getId(100),
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
      "id": <Random ObjectID>,
      "title": "sol1",
    }
  `);
});

it('should throw if more than 3 solutions', async () => {
  const create = () =>
    execContract(
      createSolution,
      {
        values: {
          submissionId: getId(100),
          title: 'sol1',
        },
      },

      'user1_token'
    );
  await expect(
    Promise.all([create(), create(), create(), create()])
  ).rejects.toMatchInlineSnapshot(
    `[AppError: You cannot create more solutions. Limit is 3.]`
  );
});
