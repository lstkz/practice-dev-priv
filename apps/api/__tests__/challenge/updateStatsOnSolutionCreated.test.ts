import { getId, setupDb } from '../helper';
import {
  createSampleChallenges,
  getSampleSolutionValues,
  registerSampleUsers,
} from '../seed-data';
import { ChallengeCollection } from '../../src/collections/Challenge';
import { SolutionCollection } from '../../src/collections/Solution';
import { updateStatsOnSolutionCreated } from '../../src/contracts/challenge/updateStatsOnSolutionCreated';

setupDb();

beforeEach(async () => {
  await registerSampleUsers();
  await createSampleChallenges();
  await SolutionCollection.insertMany([
    getSampleSolutionValues(100),
    getSampleSolutionValues(101),
  ]);
});

it('should process a single solution', async () => {
  let challenge = await ChallengeCollection.findByIdOrThrow('1_2');
  challenge.stats.solutions = 10;
  await ChallengeCollection.update(challenge, ['stats']);
  await updateStatsOnSolutionCreated(getId(100));
  challenge = await ChallengeCollection.findByIdOrThrow('1_2');
  expect(challenge.stats).toMatchInlineSnapshot(`
Object {
  "passingSubmissions": 0,
  "solutions": 11,
  "totalSubmissions": 0,
  "uniqueAttempts": 0,
}
`);
});

it('should process two submissions from the same user', async () => {
  await Promise.all([
    updateStatsOnSolutionCreated(getId(100)),
    updateStatsOnSolutionCreated(getId(101)),
  ]);
  const challenge = await ChallengeCollection.findByIdOrThrow('1_2');
  expect(challenge.stats).toMatchInlineSnapshot(`
Object {
  "passingSubmissions": 0,
  "solutions": 2,
  "totalSubmissions": 0,
  "uniqueAttempts": 0,
}
`);
});
