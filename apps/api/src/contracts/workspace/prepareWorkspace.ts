import { S } from 'schema';
import { createContract, s3 } from '../../lib';
import { WorkspaceCollection } from '../../collections/Workspace';
import { ChallengeCollection } from '../../collections/Challenge';
import { WorkspaceNodeCollection } from '../../collections/WorkspaceNode';
import { createWorkspaceNodes } from '../../common/workspace-tree';
import { config } from 'config';
import { getWorkspaceNodeS3Key } from '../../common/helper';
import { withTransaction } from '../../db';
import { WorkspaceNodeType } from 'shared';

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
                CopySource: `/${config.aws.s3Bucket}/${item.sourceS3Key}`,
                Key: item.s3Key,
              },
              undefined
            )
            .promise();
        }
      })
    );
    await withTransaction(async () => {
      const existingCount = await WorkspaceNodeCollection.countDocuments({
        workspaceId: workspaceId,
      });
      if (existingCount) {
        return;
      }
      await WorkspaceNodeCollection.insertMany(workspaceItems);
      workspace.isReady = true;
      await WorkspaceCollection.update(workspace, ['isReady']);
    });
  });
