import { S } from 'schema';
import { ReadOnlyWorkspace } from 'shared';
import { SubmissionCollection } from '../../collections/Submission';
import { AppError, ForbiddenError } from '../../common/errors';
import { mapSubmissionToWorkspace } from '../../common/mapper';
import { createContract, createRpcBinding } from '../../lib';

export const getSubmissionReadonlyWorkspace = createContract(
  'submission.getSubmissionReadonlyWorkspace'
)
  .params('user', 'id')
  .schema({
    user: S.object().appUser(),
    id: S.string().objectId(),
  })
  .returns<ReadOnlyWorkspace>()
  .fn(async (user, id) => {
    const submission = await SubmissionCollection.findById(id);
    if (!submission) {
      throw new AppError('Submission not found');
    }
    if (!submission.userId.equals(user._id)) {
      throw new ForbiddenError('No access to this submission');
    }
    if (!submission.isCloned) {
      throw new AppError('Workspace not ready');
    }
    return mapSubmissionToWorkspace(submission);
  });

export const getSubmissionReadonlyWorkspaceRpc = createRpcBinding({
  injectUser: true,
  signature: 'submission.getSubmissionReadonlyWorkspace',
  handler: getSubmissionReadonlyWorkspace,
});
