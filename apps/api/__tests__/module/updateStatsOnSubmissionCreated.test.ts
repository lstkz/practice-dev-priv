import { SubmissionCollection } from '../../src/collections/Submission';
import { getId, setupDb } from '../helper';
import {
  createSampleChallenges,
  getSampleSubmissionValues,
  registerSampleUsers,
} from '../seed-data';
import { updateStatsOnSubmissionCreated } from '../../src/contracts/module/updateStatsOnSubmissionCreated';
import { ModuleCollection } from '../../src/collections/Module';

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
  const module = await ModuleCollection.findByIdOrThrow(1);
  expect(module.stats).toMatchInlineSnapshot(`
Object {
  "enrolledUsers": 1,
}
`);
});

it('should process two submissions from the same user', async () => {
  await Promise.all([
    updateStatsOnSubmissionCreated(getId(100)),
    updateStatsOnSubmissionCreated(getId(101)),
  ]);
  const module = await ModuleCollection.findByIdOrThrow(1);
  expect(module.stats).toMatchInlineSnapshot(`
Object {
  "enrolledUsers": 1,
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
  const module = await ModuleCollection.findByIdOrThrow(1);
  expect(module.stats).toMatchInlineSnapshot(`
Object {
  "enrolledUsers": 2,
}
`);
});
