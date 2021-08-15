import { ObjectID } from 'mongodb2';
import { S } from 'schema';
import { ChallengeCollection } from '../../collections/Challenge';
import {
  ChallengeSolvedCollection,
  getChallengeSolvedId,
} from '../../collections/ChallengeSolved';
import { SubmissionCollection } from '../../collections/Submission';
import { withTransaction } from '../../db';
import { dispatchEvent } from '../../dispatch';
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
    const newChallengeSolved = await withTransaction(async () => {
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
      if (challengeSolved) {
        return null;
      }
      const challenge = await ChallengeCollection.findByIdOrThrow(
        submission.challengeUniqId
      );
      const newChallengeSolved = {
        _id: solvedId,
        userId: submission.userId,
        challengeId: challenge._id,
        moduleId: challenge.moduleId,
      };
      await ChallengeSolvedCollection.insertOne({
        _id: solvedId,
        userId: submission.userId,
        challengeId: challenge._id,
        moduleId: challenge.moduleId,
      });
      return newChallengeSolved;
    });
    if (newChallengeSolved) {
      await dispatchEvent({
        type: 'ChallengeSolved',
        payload: {
          userId: newChallengeSolved.userId.toHexString(),
          challengeId: newChallengeSolved.challengeId,
          moduleId: newChallengeSolved.moduleId,
        },
      });
    }
  });

export const updateStatsOnSubmissionPassedEvent = createEventBinding({
  type: 'SubmissionPassed',
  handler: async (_, event) => {
    await updateStatsOnSubmissionPassed(
      ObjectID.createFromHexString(event.submissionId)
    );
  },
});
