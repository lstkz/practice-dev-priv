import { ForbiddenError } from 'apollo-server';
import { ObjectID } from 'mongodb2';
import {
  WorkspaceCollection,
  WorkspaceModel,
} from '../../collections/Workspace';
import {
  WorkspaceNodeCollection,
  WorkspaceNodeModel,
  WorkspaceNodeType,
} from '../../collections/WorkspaceNode';
import { AppError } from '../../common/errors';
import { AppUser } from '../../types';
import { createWorkspaceS3Auth } from './createWorkspaceS3Auth';

export async function getNodeByIdWithCheck(appUser: AppUser, id: string) {
  const node = await WorkspaceNodeCollection.findById(id);
  if (!node) {
    throw new AppError('Node not found');
  }
  if (!node.userId.equals(appUser._id)) {
    throw new ForbiddenError('Not permission to access this workspace');
  }
  return node;
}

export async function validateValidParentId(
  workspaceId: ObjectID,
  parentId: string
) {
  const parent = await WorkspaceNodeCollection.findById(parentId);
  if (!parent) {
    throw new AppError('Invalid parentId');
  }
  if (!parent.workspaceId.equals(workspaceId)) {
    throw new AppError('Parent must belong to the same workspace');
  }
  if (parent.type !== WorkspaceNodeType.Directory) {
    throw new AppError('Parent must be a directory type');
  }
}

export async function ensureNodeUnique(node: WorkspaceNodeModel) {
  if (!node.uniqueKey) {
    throw new Error('uniqueKey is not set');
  }
  const existing = await WorkspaceNodeCollection.findOne({
    uniqueKey: node.uniqueKey,
  });
  if (existing && existing._id !== node._id) {
    throw new AppError('Duplicated node name in the same folder.');
  }
}

export async function renewWorkspaceAuth(workspace: WorkspaceModel) {
  if (
    !workspace.s3Auth ||
    workspace.s3Auth.credentialsExpiresAt.getTime() < Date.now()
  ) {
    workspace.s3Auth = await createWorkspaceS3Auth(workspace._id);
    await WorkspaceCollection.update(workspace, ['s3Auth']);
  }
}
