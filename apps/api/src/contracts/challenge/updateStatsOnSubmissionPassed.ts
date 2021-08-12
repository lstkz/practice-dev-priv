import { ObjectID } from 'mongodb2';
import { S } from 'schema';
import { ChallengeCollection } from '../../collections/Challenge';
import {
  ChallengeSolvedCollection,
  getChallengeSolvedId,
} from '../../collections/ChallengeSolved';
import { SubmissionCollection } from '../../collections/Submission';
import { withTransaction } from '../../db';
import { createContract, createEventBinding } from '../../lib';

export const updateStatsOnSubmissionPassed = createContract(
  'challenge.updateStatsOnSubmissionPassed'
)
  .params('submissionId')
  .schema({
    submissionId: S.string().objectId(),
  })
  .returns<void>()
  .fn(async submissionId => {
    const submission = await SubmissionCollection.findByIdOrThrow(submissionId);
    await withTransaction(async () => {
      await ChallengeCollection.findOneAndUpdate(
        {
          _id: submission.challengeUniqId,
        },
        {
          $inc: {
            'stats.passingSubmissions': 1,
          },
        }
      );
      const solvedId = getChallengeSolvedId({
        userId: submission.userId,
        challengeId: submission.challengeUniqId,
      });
      const challengeSolved = await ChallengeSolvedCollection.findById(
        solvedId
      );
      if (!challengeSolved) {
        const challenge = await ChallengeCollection.findByIdOrThrow(
          submission.challengeUniqId
        );
        await ChallengeSolvedCollection.insertOne({
          _id: solvedId,
          userId: submission.userId,
          challengeId: challenge._id,
          moduleId: challenge.moduleId,
        });
      }
    });
  });

export const updateStatsOnSubmissionPassedEvent = createEventBinding({
  type: 'SubmissionPassed',
  handler: async (_, event) => {
    await updateStatsOnSubmissionPassed(
      ObjectID.createFromHexString(event.submissionId)
    );
  },
});
