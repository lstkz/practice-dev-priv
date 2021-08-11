import { S } from 'schema';
import { Workspace } from 'shared';
import { SubmissionCollection } from '../../collections/Submission';
import { WorkspaceCollection } from '../../collections/Workspace';
import { AppError, ForbiddenError } from '../../common/errors';
import { createContract, createRpcBinding } from '../../lib';
import { forkAnySubmission } from './forkAnySubmission';

export const forkSubmission = createContract('submission.forkSubmission')
  .params('user', 'workspaceId', 'submissionId')
  .schema({
    user: S.object().appUser(),
    workspaceId: S.string().objectId(),
    submissionId: S.string().objectId(),
  })
  .returns<Workspace>()
  .fn(async (user, workspaceId, submissionId) => {
    const [workspace, submission] = await Promise.all([
      WorkspaceCollection.findById(workspaceId),
      SubmissionCollection.findById(submissionId),
    ]);
    if (!workspace) {
      throw new AppError('Workspace not found');
    }
    if (!submission) {
      throw new AppError('Submission not found');
    }
    if (!workspace.userId.equals(user._id)) {
      throw new ForbiddenError('No access to workspace');
    }
    if (!submission.userId.equals(user._id)) {
      throw new ForbiddenError('No access to submission');
    }
    return forkAnySubmission(user, workspaceId, submissionId);
  });

export const forkSubmissionRpc = createRpcBinding({
  injectUser: true,
  signature: 'submission.forkSubmission',
  handler: forkSubmission,
});
