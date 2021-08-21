import { ChallengeCollection } from '../../src/collections/Challenge';
import { ChallengeSolvedCollection } from '../../src/collections/ChallengeSolved';
import { ModuleCollection } from '../../src/collections/Module';
import { getModule } from '../../src/contracts/module/getModule';
import { execContract, setupDb } from '../helper';
import {
  getSampleChallengeSolvedValues,
  getSampleChallengeValues,
  getSampleModuleValues,
  registerSampleUsers,
} from '../seed-data';

setupDb();

beforeEach(async () => {
  await registerSampleUsers();
  await Promise.all([
    ModuleCollection.insertMany([getSampleModuleValues(1)]),
    ChallengeCollection.insertMany([
      getSampleChallengeValues(1, 1),
      getSampleChallengeValues(1, 2),
    ]),
    ChallengeSolvedCollection.insertMany([
      getSampleChallengeSolvedValues(1, 1, 1),
    ]),
  ]);
});

it('should throw if module no values', async () => {
  await expect(
    execContract(
      getModule,
      {
        values: {},
      },

      'user1_token'
    )
  ).rejects.toMatchInlineSnapshot(`[AppError: id or slug required]`);
});

it('should throw if module not found by id', async () => {
  await expect(
    execContract(
      getModule,
      {
        values: {
          id: 100,
        },
      },
      'user1_token'
    )
  ).rejects.toMatchInlineSnapshot(`[AppError: Module not found]`);
});

it('should throw if module is coming soon', async () => {
  await ModuleCollection.findOneAndUpdate(
    {
      _id: 1,
    },
    {
      $set: {
        isComingSoon: true,
      },
    }
  );
  await expect(
    execContract(
      getModule,
      {
        values: {
          id: 1,
        },
      },

      'user1_token'
    )
  ).rejects.toMatchInlineSnapshot(`[AppError: Module is not published]`);
});

it('should throw if module not found by slug', async () => {
  await expect(
    execContract(
      getModule,
      {
        values: {
          slug: 'aaaaa',
        },
      },
      'user1_token'
    )
  ).rejects.toMatchInlineSnapshot(`[AppError: Module not found]`);
});

it('should return a module by id', async () => {
  expect(
    await execContract(
      getModule,
      {
        values: {
          id: 1,
        },
      },

      'user1_token'
    )
  ).toMatchInlineSnapshot(`
    Object {
      "description": "desc",
      "difficulty": "easy",
      "id": 1,
      "isAttempted": false,
      "mainTechnology": "react",
      "slug": "m-1",
      "solvedChallenges": 1,
      "stats": Object {
        "enrolledUsers": 0,
      },
      "tags": Array [],
      "title": "module1",
      "totalChallenges": 2,
      "totalTime": 20,
    }
  `);
});

it('should return a module by slug', async () => {
  expect(
    await execContract(
      getModule,
      {
        values: {
          slug: 'm-1',
        },
      },

      'user1_token'
    )
  ).toMatchInlineSnapshot(`
    Object {
      "description": "desc",
      "difficulty": "easy",
      "id": 1,
      "isAttempted": false,
      "mainTechnology": "react",
      "slug": "m-1",
      "solvedChallenges": 1,
      "stats": Object {
        "enrolledUsers": 0,
      },
      "tags": Array [],
      "title": "module1",
      "totalChallenges": 2,
      "totalTime": 20,
    }
  `);
});

it('should return a module as anonymous', async () => {
  expect(
    await execContract(getModule, {
      values: {
        id: 1,
      },
    })
  ).toMatchInlineSnapshot(`
    Object {
      "description": "desc",
      "difficulty": "easy",
      "id": 1,
      "isAttempted": false,
      "mainTechnology": "react",
      "slug": "m-1",
      "solvedChallenges": 0,
      "stats": Object {
        "enrolledUsers": 0,
      },
      "tags": Array [],
      "title": "module1",
      "totalChallenges": 2,
      "totalTime": 20,
    }
  `);
});
