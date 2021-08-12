import { ObjectID } from 'mongodb2';
import { S } from 'schema';
import { ChallengeCollection } from '../../collections/Challenge';
import { SolutionCollection } from '../../collections/Solution';
import { withTransaction } from '../../db';
import { createContract, createEventBinding } from '../../lib';

export const updateStatsOnSolutionDeleted = createContract(
  'challenge.updateStatsOnSolutionDeleted'
)
  .params('solutionId')
  .schema({
    solutionId: S.string().objectId(),
  })
  .returns<void>()
  .fn(async solutionId => {
    const solution = await SolutionCollection.findByIdOrThrow(solutionId);
    await withTransaction(async () => {
      await ChallengeCollection.findOneAndUpdate(
        {
          _id: solution.challengeId,
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
    await updateStatsOnSolutionDeleted(
      ObjectID.createFromHexString(event.solutionId)
    );
  },
});
