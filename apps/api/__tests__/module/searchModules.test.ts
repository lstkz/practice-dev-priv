import { ChallengeCollection } from '../../src/collections/Challenge';
import { ChallengeAttemptCollection } from '../../src/collections/ChallengeAttempt';
import { ChallengeSolvedCollection } from '../../src/collections/ChallengeSolved';
import { ModuleCollection } from '../../src/collections/Module';
import { searchModules } from '../../src/contracts/module/searchModules';
import { execContract, setupDb } from '../helper';
import {
  getChallengeAttemptValues,
  getSampleChallengeSolvedValues,
  getSampleChallengeValues,
  getSampleModuleValues,
  registerSampleUsers,
} from '../seed-data';

setupDb();

beforeEach(async () => {
  await registerSampleUsers();
  await Promise.all([
    ModuleCollection.insertMany([
      getSampleModuleValues(1),
      getSampleModuleValues(2),
      getSampleModuleValues(3),
    ]),
    ChallengeCollection.insertMany([
      getSampleChallengeValues(1, 1),
      getSampleChallengeValues(1, 2),
      getSampleChallengeValues(1, 3),
      getSampleChallengeValues(2, 1),
      getSampleChallengeValues(2, 2),
      getSampleChallengeValues(3, 1),
    ]),
    ChallengeSolvedCollection.insertMany([
      getSampleChallengeSolvedValues(1, 1, 1),
      getSampleChallengeSolvedValues(1, 2, 1),
      getSampleChallengeSolvedValues(1, 2, 2),
      getSampleChallengeSolvedValues(2, 1, 1),
      getSampleChallengeSolvedValues(2, 1, 2),
      getSampleChallengeSolvedValues(3, 1, 2),
    ]),
    ChallengeAttemptCollection.insertMany([getChallengeAttemptValues(1, 1, 1)]),
  ]);
});

it('should search modules', async () => {
  expect(
    await execContract(
      searchModules,
      {
        criteria: {
          limit: 100,
          offset: 0,
        },
      },

      'user1_token'
    )
  ).toMatchInlineSnapshot(`
    Object {
      "items": Array [
        Object {
          "description": "desc",
          "difficulty": "easy",
          "id": 1,
          "isAttempted": true,
          "mainTechnology": "react",
          "slug": "m-1",
          "solvedChallenges": 2,
          "stats": Object {
            "enrolledUsers": 0,
          },
          "tags": Array [],
          "title": "module1",
          "totalChallenges": 3,
          "totalTime": 30,
        },
        Object {
          "description": "desc",
          "difficulty": "easy",
          "id": 2,
          "isAttempted": false,
          "mainTechnology": "react",
          "slug": "m-2",
          "solvedChallenges": 1,
          "stats": Object {
            "enrolledUsers": 0,
          },
          "tags": Array [],
          "title": "module2",
          "totalChallenges": 2,
          "totalTime": 20,
        },
        Object {
          "description": "desc",
          "difficulty": "easy",
          "id": 3,
          "isAttempted": false,
          "mainTechnology": "react",
          "slug": "m-3",
          "solvedChallenges": 0,
          "stats": Object {
            "enrolledUsers": 0,
          },
          "tags": Array [],
          "title": "module3",
          "totalChallenges": 1,
          "totalTime": 10,
        },
      ],
      "total": 3,
    }
  `);
});

it('should search modules as anonymous', async () => {
  expect(
    await execContract(searchModules, {
      criteria: {
        limit: 100,
        offset: 0,
      },
    })
  ).toMatchInlineSnapshot(`
    Object {
      "items": Array [
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
          "totalChallenges": 3,
          "totalTime": 30,
        },
        Object {
          "description": "desc",
          "difficulty": "easy",
          "id": 2,
          "isAttempted": false,
          "mainTechnology": "react",
          "slug": "m-2",
          "solvedChallenges": 0,
          "stats": Object {
            "enrolledUsers": 0,
          },
          "tags": Array [],
          "title": "module2",
          "totalChallenges": 2,
          "totalTime": 20,
        },
        Object {
          "description": "desc",
          "difficulty": "easy",
          "id": 3,
          "isAttempted": false,
          "mainTechnology": "react",
          "slug": "m-3",
          "solvedChallenges": 0,
          "stats": Object {
            "enrolledUsers": 0,
          },
          "tags": Array [],
          "title": "module3",
          "totalChallenges": 1,
          "totalTime": 10,
        },
      ],
      "total": 3,
    }
  `);
});
