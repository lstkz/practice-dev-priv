import { ActivityCollection } from '../../src/collections/Activity';
import { ChallengeCollection } from '../../src/collections/Challenge';
import { ModuleCollection } from '../../src/collections/Module';
import { searchActivities } from '../../src/contracts/activity/searchActivities';
import { execContract, getId, setupDb } from '../helper';
import {
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
    ActivityCollection.insertMany([
      {
        createdAt: new Date(1),
        userId: getId(1),
        data: {
          type: 'registered',
        },
      },
      {
        createdAt: new Date(10),
        userId: getId(1),
        data: {
          type: 'challenge-solved',
          values: {
            challengeId: '1_1',
            moduleId: 1,
          },
        },
      },
      {
        createdAt: new Date(2),
        userId: getId(1),
        data: {
          type: 'challenge-solved',
          values: {
            challengeId: '1_2',
            moduleId: 1,
          },
        },
      },
    ]),
  ]);
});

it('should search modules', async () => {
  await expect(
    execContract(searchActivities, {
      criteria: {
        username: 'asdsad',
        limit: 100,
        offset: 0,
      },
    })
  ).rejects.toMatchInlineSnapshot(`[AppError: User not found]`);
});

it('should return empty activities', async () => {
  expect(
    await execContract(searchActivities, {
      criteria: {
        username: 'user2',
        limit: 100,
        offset: 0,
      },
    })
  ).toMatchInlineSnapshot(`
    Object {
      "items": Array [],
      "total": 0,
    }
  `);
});

it('should return activities', async () => {
  expect(
    await execContract(searchActivities, {
      criteria: {
        username: 'user1',
        limit: 100,
        offset: 0,
      },
    })
  ).toMatchInlineSnapshot(`
    Object {
      "items": Array [
        Object {
          "type": "challenge-solved",
          "values": Object {
            "challenge": Object {
              "challengeModuleId": 1,
              "id": "1_1",
              "moduleId": 1,
              "title": "challenge 1",
            },
            "createdAt": "1970-01-01T00:00:00.010Z",
            "module": Object {
              "id": 1,
              "title": "module1",
            },
          },
        },
        Object {
          "type": "challenge-solved",
          "values": Object {
            "challenge": Object {
              "challengeModuleId": 2,
              "id": "1_2",
              "moduleId": 1,
              "title": "challenge 2",
            },
            "createdAt": "1970-01-01T00:00:00.002Z",
            "module": Object {
              "id": 1,
              "title": "module1",
            },
          },
        },
        Object {
          "type": "registered",
          "values": Object {
            "createdAt": "1970-01-01T00:00:00.001Z",
          },
        },
      ],
      "total": 3,
    }
  `);
});
