import { getChallenge } from '../../src/contracts/challenge/getChallenge';
import { execContract, setupDb } from '../helper';
import { createSampleChallenges, registerSampleUsers } from '../seed-data';

setupDb();

beforeEach(async () => {
  await registerSampleUsers();
  await createSampleChallenges();
});

it('should throw if not found', async () => {
  await expect(
    execContract(getChallenge, { id: '101' })
  ).rejects.toMatchInlineSnapshot(`[AppError: Challenge not found]`);
});

it('should return a challenge', async () => {
  expect(await execContract(getChallenge, { id: '1_2' }))
    .toMatchInlineSnapshot(`
    Object {
      "challengeModuleId": 2,
      "description": "desc",
      "detailsS3Key": "",
      "difficulty": "easy",
      "htmlS3Key": "",
      "id": "1_2",
      "moduleId": 1,
      "practiceTime": 10,
      "solutionUrl": "sol",
      "tests": Array [],
      "title": "challenge 2",
    }
  `);
});
