import { S } from 'schema';
import { Workspace } from 'shared';
import { SolutionCollection } from '../../collections/Solution';
import { WorkspaceCollection } from '../../collections/Workspace';
import { AppError, ForbiddenError } from '../../common/errors';
import { createContract, createRpcBinding } from '../../lib';
import { forkAnySubmission } from '../submission/forkAnySubmission';

export const forkSolution = createContract('solution.forkSolution')
  .params('user', 'workspaceId', 'solutionId')
  .schema({
    user: S.object().appUser(),
    workspaceId: S.string().objectId(),
    solutionId: S.string().objectId(),
  })
  .returns<Workspace>()
  .fn(async (user, workspaceId, solutionId) => {
    const [workspace, solution] = await Promise.all([
      WorkspaceCollection.findById(workspaceId),
      SolutionCollection.findById(solutionId),
    ]);
    if (!workspace) {
      throw new AppError('Workspace not found');
    }
    if (!solution) {
      throw new AppError('Solution not found');
    }
    if (!workspace.userId.equals(user._id)) {
      throw new ForbiddenError('No access to workspace');
    }
    return forkAnySubmission(user, workspaceId, solution.submissionId);
  });

export const forkSolutionRpc = createRpcBinding({
  injectUser: true,
  signature: 'solution.forkSolution',
  handler: forkSolution,
});
