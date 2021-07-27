import { S } from 'schema';
import { ObjectID } from 'mongodb2';
import { createContract, createTaskBinding, s3 } from '../../lib';
import { WorkspaceCollection } from '../../collections/Workspace';
import { ChallengeCollection } from '../../collections/Challenge';
import {
  WorkspaceItemCollection,
  WorkspaceItemType,
} from '../../collections/WorkspaceItem';
import { createWorkspaceItems } from '../../common/workspace-tree';
import { config } from 'config';

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
    const workspaceItems = createWorkspaceItems(
      {
        userId: workspace.userId,
        workspaceId: workspace._id,
      },
      challenge.files
    );

    await Promise.all(
      workspaceItems.map(async item => {
        if (item.type === WorkspaceItemType.File) {
          if (!item.sourceS3Key) {
            throw new Error('Expected sourceS3Key');
          }
          const s3Key = `workspace/${item.workspaceId}/${item._id}`;
          item.s3Key = s3Key;
          await s3
            .copyObject(
              {
                Bucket: config.aws.s3Bucket,
                CopySource: item.sourceS3Key,
                Key: s3Key,
              },
              undefined
            )
            .promise();
        }
        await WorkspaceItemCollection.insertOne(item);
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
