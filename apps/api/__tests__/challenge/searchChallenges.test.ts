import { ChallengeCollection } from '../../src/collections/Challenge';
import { ChallengeAttemptCollection } from '../../src/collections/ChallengeAttempt';
import { ChallengeSolvedCollection } from '../../src/collections/ChallengeSolved';
import { ModuleCollection } from '../../src/collections/Module';
import { searchChallenges } from '../../src/contracts/challenge/searchChallenges';
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
    ]),
    ChallengeCollection.insertMany([
      getSampleChallengeValues(1, 1),
      getSampleChallengeValues(1, 2),
      getSampleChallengeValues(1, 3),
      getSampleChallengeValues(2, 1),
    ]),
    ChallengeSolvedCollection.insertMany([
      getSampleChallengeSolvedValues(1, 1, 1),
      getSampleChallengeSolvedValues(1, 2, 1),
      getSampleChallengeSolvedValues(1, 2, 2),
    ]),
    ChallengeAttemptCollection.insertMany([getChallengeAttemptValues(1, 1, 1)]),
  ]);
});

it('should search modules', async () => {
  expect(
    await execContract(
      searchChallenges,
      {
        criteria: {
          moduleId: 1,
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
          "challengeModuleId": 1,
          "description": "desc",
          "difficulty": "easy",
          "id": "1_1",
          "isAttempted": true,
          "isSolved": true,
          "moduleId": 1,
          "practiceTime": 10,
          "slug": "1/challenge-1",
          "stats": Object {
            "passingSubmissions": 0,
            "solutions": 0,
            "totalSubmissions": 0,
            "uniqueAttempts": 0,
          },
          "title": "challenge 1",
        },
        Object {
          "challengeModuleId": 2,
          "description": "desc",
          "difficulty": "easy",
          "id": "1_2",
          "isAttempted": false,
          "isSolved": true,
          "moduleId": 1,
          "practiceTime": 10,
          "slug": "1/challenge-2",
          "stats": Object {
            "passingSubmissions": 0,
            "solutions": 0,
            "totalSubmissions": 0,
            "uniqueAttempts": 0,
          },
          "title": "challenge 2",
        },
        Object {
          "challengeModuleId": 3,
          "description": "desc",
          "difficulty": "easy",
          "id": "1_3",
          "isAttempted": false,
          "isSolved": false,
          "moduleId": 1,
          "practiceTime": 10,
          "slug": "1/challenge-3",
          "stats": Object {
            "passingSubmissions": 0,
            "solutions": 0,
            "totalSubmissions": 0,
            "uniqueAttempts": 0,
          },
          "title": "challenge 3",
        },
      ],
      "total": 3,
    }
  `);
});

it('should search modules as anonymous', async () => {
  expect(
    await execContract(searchChallenges, {
      criteria: {
        moduleId: 1,
        limit: 100,
        offset: 0,
      },
    })
  ).toMatchInlineSnapshot(`
    Object {
      "items": Array [
        Object {
          "challengeModuleId": 1,
          "description": "desc",
          "difficulty": "easy",
          "id": "1_1",
          "isAttempted": false,
          "isSolved": false,
          "moduleId": 1,
          "practiceTime": 10,
          "slug": "1/challenge-1",
          "stats": Object {
            "passingSubmissions": 0,
            "solutions": 0,
            "totalSubmissions": 0,
            "uniqueAttempts": 0,
          },
          "title": "challenge 1",
        },
        Object {
          "challengeModuleId": 2,
          "description": "desc",
          "difficulty": "easy",
          "id": "1_2",
          "isAttempted": false,
          "isSolved": false,
          "moduleId": 1,
          "practiceTime": 10,
          "slug": "1/challenge-2",
          "stats": Object {
            "passingSubmissions": 0,
            "solutions": 0,
            "totalSubmissions": 0,
            "uniqueAttempts": 0,
          },
          "title": "challenge 2",
        },
        Object {
          "challengeModuleId": 3,
          "description": "desc",
          "difficulty": "easy",
          "id": "1_3",
          "isAttempted": false,
          "isSolved": false,
          "moduleId": 1,
          "practiceTime": 10,
          "slug": "1/challenge-3",
          "stats": Object {
            "passingSubmissions": 0,
            "solutions": 0,
            "totalSubmissions": 0,
            "uniqueAttempts": 0,
          },
          "title": "challenge 3",
        },
      ],
      "total": 3,
    }
  `);
});
