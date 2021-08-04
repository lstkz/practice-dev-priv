import { S } from 'schema';
import { SubmissionCollection } from '../../collections/Submission';
import { AppError } from '../../common/errors';
import { createContract, createGraphqlBinding } from '../../lib';

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
  });

export const notifyTestProgressGraphql = createGraphqlBinding({
  resolver: {
    Mutation: {
      notifyTestProgress: (_, { notifyKey, data }) =>
        notifyTestProgress(notifyKey, data),
    },
  },
});
