import { S } from 'schema';
import { SubmissionCollection } from '../../collections/Submission';
import { AppError } from '../../common/errors';
import { getNotifyTestPubKey } from '../../common/helper';
import { createContract, createGraphqlBinding } from '../../lib';
import { publishPubSubEvent, pubsub } from '../../pubsub';

export const notifyTestProgress = createContract(
  'submission.notifyTestProgress'
)
  .params('notifyKey', 'data')
  .schema({
    notifyKey: S.string(),
    data: S.array().items(S.object().unknown().as<any>()),
  })
  .fn(async (notifyKey, data) => {
    const submission = await SubmissionCollection.findOne({
      notifyKey,
    });
    if (!submission) {
      throw new AppError('Invalid submission key');
    }
    await publishPubSubEvent(
      getNotifyTestPubKey({
        challengeId: submission.challengeUniqId,
        userId: submission.userId.toHexString(),
      }),
      {
        testProgress: data,
      }
    );
  });

export const notifyTestProgressGraphql = createGraphqlBinding({
  resolver: {
    Mutation: {
      notifyTestProgress: (_, { notifyKey, data }) =>
        notifyTestProgress(notifyKey, data),
    },
    Subscription: {
      testProgress: {
        subscribe: (_, { id }, { getUser }) => {
          return pubsub.asyncIterator(
            getNotifyTestPubKey({
              challengeId: id,
              userId: getUser().id.toHexString(),
            })
          );
        },
      },
    },
  },
});
