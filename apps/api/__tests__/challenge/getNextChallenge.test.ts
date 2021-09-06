import { ChallengeCollection } from '../../src/collections/Challenge';
import { ModuleCollection } from '../../src/collections/Module';
import { getNextChallenge } from '../../src/contracts/challenge/getNextChallenge';
import { execContract, setupDb } from '../helper';
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
      getSampleModuleValues(12),
    ]),
    ChallengeCollection.insertMany([
      getSampleChallengeValues(1, 1),
      getSampleChallengeValues(1, 3),
      getSampleChallengeValues(1, 2),
      getSampleChallengeValues(1, 4),
      getSampleChallengeValues(2, 5),
    ]),
  ]);
});

it('should return next challenge', async () => {
  expect(
    await execContract(
      getNextChallenge,
      {
        values: {
          id: '1_2',
        },
      },

      'user1_token'
    )
  ).toMatchInlineSnapshot(`
    Object {
      "next": Object {
        "id": "1_3",
        "slug": "1/challenge-3",
        "title": "challenge 3",
      },
    }
  `);
});

it('should return null if no next', async () => {
  expect(
    await execContract(
      getNextChallenge,
      {
        values: {
          id: '1_4',
        },
      },

      'user1_token'
    )
  ).toMatchInlineSnapshot(`
    Object {
      "next": null,
    }
  `);
});
