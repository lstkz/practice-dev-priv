import { S } from 'schema';
import * as uuid from 'uuid';
import { ReadOnlyWorkspace } from 'shared';
import { SubmissionCollection } from '../../collections/Submission';
import { AppError, ForbiddenError } from '../../common/errors';
import { createContract, createRpcBinding } from '../../lib';
import { renameId } from '../../common/helper';

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
    const idMap: Record<string, string> = {};
    submission.nodes.forEach(node => {
      idMap[node._id] = uuid.v4();
    });
    return {
      id: id.toHexString(),
      libraries: submission.libraries,
      items: submission.nodes.map(node => {
        const mapped = { ...renameId(node) };
        mapped.id = idMap[mapped.id];
        if (mapped.parentId) {
          mapped.parentId = idMap[mapped.parentId];
        }
        return mapped;
      }),
    };
  });

export const getSubmissionReadonlyWorkspaceRpc = createRpcBinding({
  injectUser: true,
  signature: 'submission.getSubmissionReadonlyWorkspace',
  handler: getSubmissionReadonlyWorkspace,
});
