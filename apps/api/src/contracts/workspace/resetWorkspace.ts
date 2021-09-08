import { S } from 'schema';
import { Workspace } from 'shared';
import { ChallengeCollection } from '../../collections/Challenge';
import { WorkspaceCollection } from '../../collections/Workspace';
import { WorkspaceNodeCollection } from '../../collections/WorkspaceNode';
import { AppError } from '../../common/errors';
import { createContract, createRpcBinding } from '../../lib';
import { prepareWorkspace } from './prepareWorkspace';
import { getMappedWorkspace } from './_common';

export const resetWorkspace = createContract('workspace.resetWorkspace')
  .params('workspaceId')
  .schema({
    workspaceId: S.string().objectId(),
  })
  .returns<Workspace>()
  .fn(async workspaceId => {
    const workspace = await WorkspaceCollection.findById(workspaceId);
    if (!workspace) {
      throw new AppError('Workspace not found');
    }
    const challenge = await ChallengeCollection.findByIdOrThrow(
      workspace.challengeId
    );
    await WorkspaceNodeCollection.deleteMany({
      workspaceId: workspace._id,
    });
    workspace.isReady = false;
    workspace.libraries = challenge.libraries;
    await WorkspaceCollection.update(workspace, ['isReady', 'libraries']);
    await prepareWorkspace(workspaceId);
    return getMappedWorkspace(workspace);
  });

export const resetWorkspaceRpc = createRpcBinding({
  signature: 'workspace.resetWorkspace',
  handler: resetWorkspace,
});
