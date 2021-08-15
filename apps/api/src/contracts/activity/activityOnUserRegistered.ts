import { ObjectID } from 'mongodb2';
import { S } from 'schema';
import { ActivityCollection } from '../../collections/Activity';
import { getCurrentDate } from '../../common/helper';
import { createContract, createEventBinding } from '../../lib';

export const activityOnUserRegistered = createContract(
  'activity.activityOnUserRegistered'
)
  .params('userId')
  .schema({
    userId: S.string().objectId(),
  })
  .returns<void>()
  .fn(async userId => {
    await ActivityCollection.insertOne({
      createdAt: getCurrentDate(),
      userId: userId,
      data: {
        type: 'registered',
      },
    });
  });

export const updateStatsOnSubmissionPassedEvent = createEventBinding({
  type: 'UserRegistered',
  handler: async (_, event) => {
    await activityOnUserRegistered(ObjectID.createFromHexString(event.userId));
  },
});
