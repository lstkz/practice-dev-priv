import { S } from 'schema';
import { WorkspaceNodeCollection } from '../../collections/WorkspaceNode';
import { AppError } from '../../common/errors';
import { findNodeAllChildren } from '../../common/workspace-tree';
import { createContract, createGraphqlBinding } from '../../lib';
import { getNodeByIdWithCheck } from './_common';

export const deleteWorkspaceNode = createContract(
  'workspace.deleteWorkspaceNode'
)
  .params('appUser', 'id')
  .schema({
    appUser: S.object().appUser(),
    id: S.string(),
  })
  .fn(async (appUser, id) => {
    const node = await getNodeByIdWithCheck(appUser, id);
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

export const deleteWorkspaceNodeGraphql = createGraphqlBinding({
  resolver: {
    Mutation: {
      deleteWorkspaceNode: (_, { id }, { getUser }) =>
        deleteWorkspaceNode(getUser(), id),
    },
  },
});
