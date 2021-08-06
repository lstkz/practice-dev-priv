import { ForbiddenError } from 'apollo-server';
import { S } from 'schema';
import { WorkspaceCollection } from '../../collections/Workspace';
import { AppError } from '../../common/errors';
import { mapWorkspaceS3Auth } from '../../common/mapper';
import { WorkspaceS3Auth } from '../../generated';
import { createContract, createRpcBinding } from '../../lib';
import { getOrCreateWorkspace } from './getOrCreateWorkspace';
import { renewWorkspaceAuth } from './_common';

export const getWorkspaceS3Auth = createContract('workspace.getWorkspaceS3Auth')
  .params('appUser', 'workspaceId')
  .schema({
    appUser: S.object().appUser(),
    workspaceId: S.string().objectId(),
  })
  .returns<WorkspaceS3Auth>()
  .fn(async (appUser, workspaceId) => {
    const workspace = await WorkspaceCollection.findById(workspaceId);
    if (!workspace) {
      throw new AppError('Workspace not found');
    }
    if (!workspace.userId.equals(appUser._id)) {
      throw new ForbiddenError('No permission to access this workspace');
    }
    await renewWorkspaceAuth(workspace);
    return mapWorkspaceS3Auth(workspace.s3Auth)!;
  });

export const getWorkspaceS3AuthRpc = createRpcBinding({
  injectUser: true,
  signature: 'workspace.getWorkspaceS3Auth',
  handler: getOrCreateWorkspace,
});
