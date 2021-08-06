import { S } from 'schema';
import { WorkspaceNodeCollection } from '../../collections/WorkspaceNode';
import { AppError } from '../../common/errors';
import { findNodeAllChildren } from '../../common/workspace-tree';
import { createContract, createRpcBinding } from '../../lib';
import { getNodeByIdWithCheck } from './_common';

export const deleteWorkspaceNode = createContract(
  'workspace.deleteWorkspaceNode'
)
  .params('user', 'id')
  .schema({
    user: S.object().appUser(),
    id: S.string(),
  })
  .fn(async (user, id) => {
    const node = await getNodeByIdWithCheck(user, id);
    const removeNodes = [node, ...(await findNodeAllChildren(node._id))];
    if (removeNodes.some(x => x.isLocked)) {
      throw new AppError('Cannot remove locked node');
    }
    await WorkspaceNodeCollection.deleteMany({
      _id: {
        $in: removeNodes.map(x => x._id),
      },
    });
  });

export const deleteWorkspaceNodeRpc = createRpcBinding({
  injectUser: true,
  signature: 'workspace.deleteWorkspaceNode',
  handler: deleteWorkspaceNode,
});
