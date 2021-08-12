import { getId, setupDb } from '../helper';
import {
  createSampleChallenges,
  getSampleSolutionValues,
  registerSampleUsers,
} from '../seed-data';
import { ChallengeCollection } from '../../src/collections/Challenge';
import { SolutionCollection } from '../../src/collections/Solution';
import { updateStatsOnSolutionDeleted } from '../../src/contracts/challenge/updateStatsOnSolutionDeleted';

setupDb();

beforeEach(async () => {
  await registerSampleUsers();
  await createSampleChallenges();
  await SolutionCollection.insertMany([
    getSampleSolutionValues(100),
    getSampleSolutionValues(101),
  ]);
  const challenge = await ChallengeCollection.findByIdOrThrow('1_2');
  challenge.stats.solutions = 10;
  await ChallengeCollection.update(challenge, ['stats']);
});

async function _getInputValues(id: number) {
  const solution = await SolutionCollection.findByIdOrThrow(getId(id));
  return {
    solutionId: solution._id,
    challengeId: solution.challengeId,
    submissionId: solution.submissionId,
    userId: solution.userId,
  };
}

it('should process a single solution', async () => {
  await updateStatsOnSolutionDeleted(await _getInputValues(100));
  const challenge = await ChallengeCollection.findByIdOrThrow('1_2');
  expect(challenge.stats).toMatchInlineSnapshot(`
Object {
  "passingSubmissions": 0,
  "solutions": 9,
  "totalSubmissions": 0,
  "uniqueAttempts": 0,
}
`);
});

it('should process two submissions from the same user', async () => {
  const input1 = await _getInputValues(100);
  const input2 = await _getInputValues(101);
  await Promise.all([
    updateStatsOnSolutionDeleted(input1),
    updateStatsOnSolutionDeleted(input2),
  ]);
  const challenge = await ChallengeCollection.findByIdOrThrow('1_2');
  expect(challenge.stats).toMatchInlineSnapshot(`
Object {
  "passingSubmissions": 0,
  "solutions": 8,
  "totalSubmissions": 0,
  "uniqueAttempts": 0,
}
`);
});
