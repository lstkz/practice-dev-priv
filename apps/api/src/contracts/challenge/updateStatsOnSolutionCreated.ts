import { ObjectID } from 'mongodb2';
import { S } from 'schema';
import { ChallengeCollection } from '../../collections/Challenge';
import { SolutionCollection } from '../../collections/Solution';
import { withTransaction } from '../../db';
import { createContract, createEventBinding } from '../../lib';

export const updateStatsOnSolutionCreated = createContract(
  'challenge.updateStatsOnSolutionCreated'
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
            'stats.solutions': 1,
          },
        }
      );
    });
  });

export const updateStatsOnSolutionCreatedEvent = createEventBinding({
  type: 'SolutionCreated',
  handler: async (_, event) => {
    await updateStatsOnSolutionCreated(
      ObjectID.createFromHexString(event.solutionId)
    );
  },
});
