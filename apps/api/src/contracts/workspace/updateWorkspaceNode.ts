import { S } from 'schema';
import { createContract, createGraphqlBinding } from '../../lib';
import { FILENAME_MAX_LENGTH, FILENAME_REGEX } from 'shared';
import {
  ensureNodeUnique,
  getNodeByIdWithCheck,
  validateValidParentId,
} from './_common';
import { WorkspaceNodeCollection } from '../../collections/WorkspaceNode';
import { getNodeUniqueKey } from '../../common/workspace-tree';

export const updateWorkspaceNode = createContract(
  'workspace.updateWorkspaceNode'
)
  .params('appUser', 'values')
  .schema({
    appUser: S.object().appUser(),
    values: S.object().keys({
      id: S.string().uuid(),
      parentId: S.string().nullable().optional(),
      hash: S.string().nullable().optional(),
      name: S.string()
        .max(FILENAME_MAX_LENGTH)
        .regex(FILENAME_REGEX)
        .nullable()
        .optional(),
    }),
  })
  .fn(async (appUser, values) => {
    const node = await getNodeByIdWithCheck(appUser, values.id);
    if (values.hash) {
      node.hash = values.hash;
    }
    if (values.name) {
      node.name = values.name;
    }
    if (values.parentId) {
      await validateValidParentId(node.workspaceId, values.parentId);
      node.parentId = values.parentId;
    } else if (values.parentId === null) {
      node.parentId = null;
    }
    node.uniqueKey = getNodeUniqueKey(node);
    await ensureNodeUnique(node);
    await WorkspaceNodeCollection.update(node, [
      'hash',
      'name',
      'parentId',
      'uniqueKey',
    ]);
  });

export const updateWorkspaceNodeGraphql = createGraphqlBinding({
  resolver: {
    Mutation: {
      updateWorkspaceNode: (_, { values }, { getUser }) =>
        updateWorkspaceNode(getUser(), values),
    },
  },
});
