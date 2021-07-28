import { S } from 'schema';
import { ObjectID } from 'mongodb2';
import { createContract, createTaskBinding, s3 } from '../../lib';
import { WorkspaceCollection } from '../../collections/Workspace';
import { ChallengeCollection } from '../../collections/Challenge';
import {
  WorkspaceNodeCollection,
  WorkspaceNodeType,
} from '../../collections/WorkspaceNode';
import { createWorkspaceNodes } from '../../common/workspace-tree';
import { config } from 'config';
import { getWorkspaceNodeS3Key } from '../../common/helper';

export const prepareWorkspace = createContract('workspace.prepareWorkspace')
  .params('workspaceId')
  .schema({
    workspaceId: S.string().objectId(),
  })
  .fn(async workspaceId => {
    const workspace = await WorkspaceCollection.findByIdOrThrow(workspaceId);
    if (workspace.isReady) {
      return;
    }
    const challenge = await ChallengeCollection.findByIdOrThrow(
      workspace.challengeUniqId
    );
    const workspaceItems = createWorkspaceNodes(
      {
        userId: workspace.userId,
        workspaceId: workspace._id,
      },
      challenge.files
    );

    await Promise.all(
      workspaceItems.map(async item => {
        if (item.type === WorkspaceNodeType.File) {
          if (!item.sourceS3Key) {
            throw new Error('Expected sourceS3Key');
          }
          item.s3Key = getWorkspaceNodeS3Key(item);
          await s3
            .copyObject(
              {
                Bucket: config.aws.s3Bucket,
                CopySource: item.sourceS3Key,
                Key: item.s3Key,
              },
              undefined
            )
            .promise();
        }
        await WorkspaceNodeCollection.insertOne(item);
      })
    );
    workspace.isReady = true;
    await WorkspaceCollection.update(workspace, ['isReady']);
  });

export const prepareWorkspaceTask = createTaskBinding({
  type: 'PrepareWorkspace',
  handler: async (_, task) => {
    await prepareWorkspace(ObjectID.createFromHexString(task.workspaceId));
  },
});
