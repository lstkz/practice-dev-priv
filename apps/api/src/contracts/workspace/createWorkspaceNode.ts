import { S } from 'schema';
import { FILENAME_MAX_LENGTH, FILENAME_REGEX, WorkspaceNodeType } from 'shared';
import { WorkspaceCollection } from '../../collections/Workspace';
import { WorkspaceNodeCollection } from '../../collections/WorkspaceNode';
import { AppError, ForbiddenError } from '../../common/errors';
import { getWorkspaceNodeS3Key, revertRenameId } from '../../common/helper';
import { getWorkspaceNodeWithUniqueKey } from '../../common/workspace-tree';
import { createContract, createRpcBinding } from '../../lib';
import { ensureNodeUnique, validateValidParentId } from './_common';

export const createWorkspaceNode = createContract(
  'workspace.createWorkspaceNode'
)
  .params('user', 'values')
  .schema({
    user: S.object().appUser(),
    values: S.object().keys({
      id: S.string().uuid(),
      workspaceId: S.string().objectId(),
      parentId: S.string().nullable().optional(),
      hash: S.string(),
      type: S.enum().values<WorkspaceNodeType>(
        Object.values(WorkspaceNodeType)
      ),
      name: S.string().max(FILENAME_MAX_LENGTH).regex(FILENAME_REGEX).trim(),
    }),
  })
  .returns<void>()
  .fn(async (user, values) => {
    const existing = await WorkspaceNodeCollection.findById(values.id);
    if (existing) {
      throw new AppError('Duplicated id');
    }
    const workspace = await WorkspaceCollection.findById(values.workspaceId);
    if (!workspace) {
      throw new AppError('Workspace not found');
    }
    if (!workspace.userId.equals(user._id)) {
      throw new ForbiddenError('Not permission to access this workspace');
    }
    if (values.parentId) {
      await validateValidParentId(values.workspaceId, values.parentId);
    }
    const node = getWorkspaceNodeWithUniqueKey({
      parentId: null,
      ...revertRenameId(values),
      userId: user._id,
      s3Key: null,
      sourceS3Key: null,
    });
    node.s3Key = getWorkspaceNodeS3Key(node);
    await ensureNodeUnique(node);
    await WorkspaceNodeCollection.insertOne(node);
  });

export const createWorkspaceNodeRpc = createRpcBinding({
  injectUser: true,
  signature: 'workspace.createWorkspaceNode',
  handler: createWorkspaceNode,
});
