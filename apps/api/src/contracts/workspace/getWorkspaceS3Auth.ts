import { ForbiddenError } from 'apollo-server';
import { S } from 'schema';
import { WorkspaceCollection } from '../../collections/Workspace';
import { AppError } from '../../common/errors';
import { mapWorkspaceS3Auth } from '../../common/mapper';
import { WorkspaceS3Auth } from '../../generated';
import { createContract, createGraphqlBinding } from '../../lib';
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
    if (!workspace.userId.equals(appUser.id)) {
      throw new ForbiddenError('No permission to access this workspace');
    }
    await renewWorkspaceAuth(workspace);
    return mapWorkspaceS3Auth(workspace.s3Auth)!;
  });

export const getWorkspaceS3AuthGraphql = createGraphqlBinding({
  resolver: {
    Query: {
      getWorkspaceS3Auth: (_, { workspaceId }, { getUser }) =>
        getWorkspaceS3Auth(getUser(), workspaceId as any),
    },
  },
});
