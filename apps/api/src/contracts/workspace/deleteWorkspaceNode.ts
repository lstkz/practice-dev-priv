import { S } from 'schema';
import {
  WorkspaceNodeCollection,
  WorkspaceNodeModel,
} from '../../collections/WorkspaceNode';
import { createContract, createGraphqlBinding } from '../../lib';
import { getNodeByIdWithCheck } from './_common';

async function _findAllChildren(parentId: string) {
  const ret: WorkspaceNodeModel[] = [];
  const travel = async (parentId: string) => {
    const children = await WorkspaceNodeCollection.findAll({ parentId });
    ret.push(...children);
    await Promise.all(children.map(child => travel(child._id)));
  };
  await travel(parentId);
  return ret;
}

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
    const removeNodes = [node, ...(await _findAllChildren(node._id))];
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
