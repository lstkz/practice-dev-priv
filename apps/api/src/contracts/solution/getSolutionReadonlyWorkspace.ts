import { S } from 'schema';
import { ReadOnlyWorkspace } from 'shared';
import { SolutionCollection } from '../../collections/Solution';
import { SubmissionCollection } from '../../collections/Submission';
import { AppError } from '../../common/errors';
import { mapSubmissionToWorkspace } from '../../common/mapper';
import { createContract, createRpcBinding } from '../../lib';

export const getSolutionReadonlyWorkspace = createContract(
  'solution.getSolutionReadonlyWorkspace'
)
  .params('user', 'id')
  .schema({
    user: S.object().appUser(),
    id: S.string().objectId(),
  })
  .returns<ReadOnlyWorkspace>()
  .fn(async (user, id) => {
    const solution = await SolutionCollection.findById(id);
    if (!solution) {
      throw new AppError('Solution not found');
    }
    const submission = await SubmissionCollection.findByIdOrThrow(
      solution.submissionId
    );
    return mapSubmissionToWorkspace(submission);
  });

export const getSolutionReadonlyWorkspaceRpc = createRpcBinding({
  injectUser: true,
  signature: 'solution.getSolutionReadonlyWorkspace',
  handler: getSolutionReadonlyWorkspace,
});
