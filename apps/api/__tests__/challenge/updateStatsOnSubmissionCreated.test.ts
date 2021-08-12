import { SubmissionCollection } from '../../src/collections/Submission';
import { getId, setupDb } from '../helper';
import {
  createSampleChallenges,
  getSampleSubmissionValues,
  registerSampleUsers,
} from '../seed-data';
import { updateStatsOnSubmissionCreated } from '../../src/contracts/challenge/updateStatsOnSubmissionCreated';
import { ChallengeCollection } from '../../src/collections/Challenge';

setupDb();

beforeEach(async () => {
  await registerSampleUsers();
  await createSampleChallenges();
  await SubmissionCollection.insertMany([
    getSampleSubmissionValues(100),
    getSampleSubmissionValues(101),
    getSampleSubmissionValues(102),
    getSampleSubmissionValues(103, {
      userId: getId(2),
    }),
  ]);
});

it('should process a single submission', async () => {
  await updateStatsOnSubmissionCreated(getId(100));
  const challenge = await ChallengeCollection.findByIdOrThrow('1_2');
  expect(challenge.stats).toMatchInlineSnapshot(`
Object {
  "passingSubmissions": 0,
  "solutions": 0,
  "totalSubmissions": 1,
  "uniqueAttempts": 1,
}
`);
});

it('should process two submissions from the same user', async () => {
  await Promise.all([
    updateStatsOnSubmissionCreated(getId(100)),
    updateStatsOnSubmissionCreated(getId(101)),
  ]);
  const challenge = await ChallengeCollection.findByIdOrThrow('1_2');
  expect(challenge.stats).toMatchInlineSnapshot(`
Object {
  "passingSubmissions": 0,
  "solutions": 0,
  "totalSubmissions": 2,
  "uniqueAttempts": 1,
}
`);
});

it('should process 3 + 1 submissions', async () => {
  await Promise.all([
    updateStatsOnSubmissionCreated(getId(100)),
    updateStatsOnSubmissionCreated(getId(101)),
    updateStatsOnSubmissionCreated(getId(102)),
    updateStatsOnSubmissionCreated(getId(103)),
  ]);
  const challenge = await ChallengeCollection.findByIdOrThrow('1_2');
  expect(challenge.stats).toMatchInlineSnapshot(`
Object {
  "passingSubmissions": 0,
  "solutions": 0,
  "totalSubmissions": 4,
  "uniqueAttempts": 2,
}
`);
});
