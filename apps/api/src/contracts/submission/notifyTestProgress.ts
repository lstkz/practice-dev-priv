import { S } from 'schema';
import { SubmissionCollection } from '../../collections/Submission';
import { AppError } from '../../common/errors';
import { dispatchSocketMsg } from '../../dispatch';
import { createContract, createRpcBinding } from '../../lib';

export const notifyTestProgress = createContract(
  'submission.notifyTestProgress'
)
  .params('notifyKey', 'data')
  .schema({
    notifyKey: S.string(),
    data: S.array().items(S.object().unknown().as<any>()),
  })
  .returns<void>()
  .fn(async (notifyKey, data) => {
    const submission = await SubmissionCollection.findOne({
      notifyKey,
    });
    if (!submission) {
      throw new AppError('Invalid submission key');
    }
    for (const msg of data) {
      msg.meta.userId = submission.userId.toHexString();
      await dispatchSocketMsg(msg);
    }
  });

export const notifyTestProgressRpc = createRpcBinding({
  public: true,
  signature: 'submission.notifyTestProgress',
  handler: notifyTestProgress,
});
