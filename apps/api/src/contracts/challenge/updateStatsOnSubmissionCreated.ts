import { ObjectID } from 'mongodb2';
import { S } from 'schema';
import { ChallengeCollection } from '../../collections/Challenge';
import {
  ChallengeAttemptCollection,
  getChallengeAttemptId,
} from '../../collections/ChallengeAttempt';
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
      submission.challengeId
    );
    await withTransaction(async () => {
      const challengeAttemptId = getChallengeAttemptId({
        challengeId: challenge._id,
        userId: submission.userId,
      });
      const challengeAttempt = await ChallengeAttemptCollection.findById(
        challengeAttemptId
      );
      if (!challengeAttempt) {
        await ChallengeAttemptCollection.insertOne({
          _id: challengeAttemptId,
          challengeId: challenge._id,
          userId: submission.userId,
          moduleId: challenge.moduleId,
        });
      }
      await ChallengeCollection.findOneAndUpdate(
        {
          _id: submission.challengeId,
        },
        {
          $inc: {
            'stats.totalSubmissions': 1,
            'stats.uniqueAttempts': challengeAttempt ? 0 : 1,
          },
        }
      );
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
