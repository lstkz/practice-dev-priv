import { getChallenge } from '../../src/contracts/challenge/getChallenge';
import { execContract, setupDb } from '../helper';
import { createSampleChallenges, registerSampleUsers } from '../seed-data';

setupDb();

beforeEach(async () => {
  await registerSampleUsers();
  await createSampleChallenges();
});

it('should throw if no params', async () => {
  await expect(
    execContract(getChallenge, {
      values: {},
    })
  ).rejects.toMatchInlineSnapshot(`[AppError: id or slug required]`);
});

it('should throw if not found by id', async () => {
  await expect(
    execContract(getChallenge, {
      values: {
        id: '1_2444',
      },
    })
  ).rejects.toMatchInlineSnapshot(`[AppError: Challenge not found]`);
});

it('should throw if not found by slug', async () => {
  await expect(
    execContract(getChallenge, {
      values: {
        slug: 'bbbb',
      },
    })
  ).rejects.toMatchInlineSnapshot(`[AppError: Challenge not found]`);
});

it('should return a challenge by id', async () => {
  expect(
    await execContract(getChallenge, {
      values: {
        id: '1_2',
      },
    })
  ).toMatchInlineSnapshot(`
    Object {
      "challengeModuleId": 2,
      "description": "desc",
      "detailsS3Key": "",
      "difficulty": "easy",
      "htmlS3Key": "",
      "id": "1_2",
      "moduleId": 1,
      "practiceTime": 10,
      "slug": "challenge-2",
      "solutionUrl": "sol",
      "tests": Array [],
      "title": "challenge 2",
    }
  `);
});

it('should return a challenge by slug', async () => {
  expect(
    await execContract(getChallenge, {
      values: {
        slug: 'challenge-2',
      },
    })
  ).toMatchInlineSnapshot(`
    Object {
      "challengeModuleId": 2,
      "description": "desc",
      "detailsS3Key": "",
      "difficulty": "easy",
      "htmlS3Key": "",
      "id": "1_2",
      "moduleId": 1,
      "practiceTime": 10,
      "slug": "challenge-2",
      "solutionUrl": "sol",
      "tests": Array [],
      "title": "challenge 2",
    }
  `);
});
