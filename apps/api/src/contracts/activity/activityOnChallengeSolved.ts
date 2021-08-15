import { ObjectID } from 'mongodb2';
import { S } from 'schema';
import { ActivityCollection } from '../../collections/Activity';
import { getCurrentDate } from '../../common/helper';
import { createContract, createEventBinding } from '../../lib';

export const activityOnChallengeSolved = createContract(
  'activity.activityOnChallengeSolved'
)
  .params('values')
  .schema({
    values: S.object().keys({
      challengeId: S.string(),
      moduleId: S.number(),
      userId: S.string().objectId(),
    }),
  })
  .returns<void>()
  .fn(async values => {
    await ActivityCollection.insertOne({
      createdAt: getCurrentDate(),
      userId: values.userId,
      data: {
        type: 'challenge-solved',
        values: {
          challengeId: values.challengeId,
          moduleId: values.moduleId,
        },
      },
    });
  });

export const updateStatsOnSubmissionPassedEvent = createEventBinding({
  type: 'ChallengeSolved',
  handler: async (_, event) => {
    await activityOnChallengeSolved({
      challengeId: event.challengeId,
      moduleId: event.moduleId,
      userId: ObjectID.createFromHexString(event.userId),
    });
  },
});
