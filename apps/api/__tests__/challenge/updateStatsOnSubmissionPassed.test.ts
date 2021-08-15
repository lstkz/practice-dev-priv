import { SubmissionCollection } from '../../src/collections/Submission';
import { getId, setupDb } from '../helper';
import {
  createSampleChallenges,
  getSampleSubmissionValues,
  registerSampleUsers,
} from '../seed-data';
import { ChallengeCollection } from '../../src/collections/Challenge';
import { updateStatsOnSubmissionPassed } from '../../src/contracts/challenge/updateStatsOnSubmissionPassed';
import { mocked } from 'ts-jest/utils';
import { dispatchEvent } from '../../src/dispatch';

jest.mock('../../src/dispatch');

const mocked_dispatchEvent = mocked(dispatchEvent);

setupDb();

beforeEach(async () => {
  await registerSampleUsers();
  await createSampleChallenges();
  await SubmissionCollection.insertMany([
    getSampleSubmissionValues(100),
    getSampleSubmissionValues(101),
  ]);
  mocked_dispatchEvent.mockReset();
});

it('should process a single submission', async () => {
  await updateStatsOnSubmissionPassed(getId(100));
  const challenge = await ChallengeCollection.findByIdOrThrow('1_2');
  expect(challenge.stats).toMatchInlineSnapshot(`
Object {
  "passingSubmissions": 1,
  "solutions": 0,
  "totalSubmissions": 0,
  "uniqueAttempts": 0,
}
`);
  expect(mocked_dispatchEvent).toBeCalledTimes(1);
});

it('should process two submissions', async () => {
  await Promise.all([
    updateStatsOnSubmissionPassed(getId(100)),
    updateStatsOnSubmissionPassed(getId(101)),
  ]);
  const challenge = await ChallengeCollection.findByIdOrThrow('1_2');
  expect(challenge.stats).toMatchInlineSnapshot(`
Object {
  "passingSubmissions": 2,
  "solutions": 0,
  "totalSubmissions": 0,
  "uniqueAttempts": 0,
}
`);
  expect(mocked_dispatchEvent).toBeCalledTimes(1);
});
