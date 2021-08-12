import { ChallengeCollection } from '../../src/collections/Challenge';
import {
  ChallengeAttemptCollection,
  getChallengeAttemptId,
} from '../../src/collections/ChallengeAttempt';
import {
  ChallengeSolvedCollection,
  getChallengeSolvedId,
} from '../../src/collections/ChallengeSolved';
import { ModuleCollection } from '../../src/collections/Module';
import { searchModules } from '../../src/contracts/module/searchModules';
import { execContract, getId, setupDb } from '../helper';
import { registerSampleUsers } from '../seed-data';

setupDb();

beforeEach(async () => {
  await registerSampleUsers();
  const getModule = (id: number) => {
    return {
      _id: id,
      title: 'module' + id,
      description: 'desc',
      difficulty: 'easy',
      mainTechnology: 'react',
      tags: [],
      stats: {
        enrolledUsers: 0,
      },
    };
  };
  const getChallenge = (moduleId: number, challengeId: number) => {
    return {
      _id: moduleId + '_' + challengeId,
      challengeId: challengeId,
      description: 'desc',
      detailsS3Key: '',
      testS3Key: 't',
      difficulty: 'easy',
      solutionUrl: 'sol',
      files: [],
      htmlS3Key: '',
      moduleId: moduleId,
      practiceTime: 10,
      title: 'challenge ' + challengeId,
      libraries: [],
      tests: [],
      stats: {
        passingSubmissions: 0,
        solutions: 0,
        totalSubmissions: 0,
        uniqueAttempts: 0,
      },
    };
  };
  const getSolved = (moduleId: number, challengeId: number, userId: number) => {
    const userId2 = getId(userId);
    const challengeUniqId = moduleId + '_' + challengeId;
    return {
      _id: getChallengeSolvedId({
        userId: userId2,
        challengeId: challengeUniqId,
      }),
      userId: userId2,
      challengeId: challengeUniqId,
      moduleId,
    };
  };
  await Promise.all([
    ModuleCollection.insertMany([getModule(1), getModule(2), getModule(3)]),
    ChallengeCollection.insertMany([
      getChallenge(1, 1),
      getChallenge(1, 2),
      getChallenge(1, 3),
      getChallenge(2, 1),
      getChallenge(2, 2),
      getChallenge(3, 1),
    ]),
    ChallengeSolvedCollection.insertMany([
      getSolved(1, 1, 1),
      getSolved(1, 2, 1),
      getSolved(1, 2, 2),
      getSolved(2, 1, 1),
      getSolved(2, 1, 2),
      getSolved(3, 1, 2),
    ]),
    ChallengeAttemptCollection.insertMany([
      {
        _id: getChallengeAttemptId({
          challengeId: '1_1',
          userId: getId(1),
        }),
        challengeId: '1_1',
        moduleId: 1,
        userId: getId(1),
      },
    ]),
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
