import { ObjectID } from 'mongodb2';
import { S } from 'schema';
import { ChallengeCollection } from '../../collections/Challenge';
import { withTransaction } from '../../db';
import { createContract, createEventBinding } from '../../lib';

export const updateStatsOnSolutionDeleted = createContract(
  'challenge.updateStatsOnSolutionDeleted'
)
  .params('values')
  .schema({
    values: S.object().keys({
      solutionId: S.string().objectId(),
      challengeId: S.string(),
      submissionId: S.string().objectId(),
      userId: S.string().objectId(),
    }),
  })
  .returns<void>()
  .fn(async values => {
    const { challengeId } = values;
    await withTransaction(async () => {
      await ChallengeCollection.findOneAndUpdate(
        {
          _id: challengeId,
        },
        {
          $inc: {
            'stats.solutions': -1,
          },
        }
      );
    });
  });

export const updateStatsOnSolutionDeletedEvent = createEventBinding({
  type: 'SolutionDeleted',
  handler: async (_, event) => {
    await updateStatsOnSolutionDeleted({
      solutionId: ObjectID.createFromHexString(event.solutionId),
      challengeId: event.challengeId,
      submissionId: ObjectID.createFromHexString(event.submissionId),
      userId: ObjectID.createFromHexString(event.userId),
    });
  },
});
