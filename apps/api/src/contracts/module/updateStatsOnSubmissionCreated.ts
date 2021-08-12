import { ObjectID } from 'mongodb2';
import { S } from 'schema';
import { ChallengeCollection } from '../../collections/Challenge';
import { ModuleCollection } from '../../collections/Module';
import {
  getModuleUserEnrolledId,
  ModuleUserEnrolledCollection,
} from '../../collections/ModuleUserEnrolled';
import { SubmissionCollection } from '../../collections/Submission';
import { withTransaction } from '../../db';
import { createContract, createEventBinding } from '../../lib';

export const updateStatsOnSubmissionCreated = createContract(
  'challenge.updateStatsOnSubmissionCreated'
)
  .params('submissionId')
  .schema({
    submissionId: S.string().objectId(),
  })
  .returns<void>()
  .fn(async submissionId => {
    const submission = await SubmissionCollection.findByIdOrThrow(submissionId);
    const challenge = await ChallengeCollection.findByIdOrThrow(
      submission.challengeUniqId
    );
    const module = await ModuleCollection.findByIdOrThrow(challenge.moduleId);
    await withTransaction(async () => {
      const enrolledId = getModuleUserEnrolledId({
        moduleId: module._id,
        userId: submission.userId,
      });
      const enrolled = await ModuleUserEnrolledCollection.findById(enrolledId);
      if (!enrolled) {
        await ModuleUserEnrolledCollection.insertOne({
          _id: enrolledId,
          moduleId: module._id,
          userId: submission.userId,
        });
        await ModuleCollection.findOneAndUpdate(
          {
            _id: module._id,
          },
          {
            $inc: {
              'stats.enrolledUsers': 1,
            },
          }
        );
      }
    });
  });

export const updateStatsOnSubmissionCreatedEvent = createEventBinding({
  type: 'SubmissionCreated',
  handler: async (_, event) => {
    await updateStatsOnSubmissionCreated(
      ObjectID.createFromHexString(event.submissionId)
    );
  },
});
