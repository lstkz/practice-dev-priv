import { config } from 'config';
import { S } from 'schema';
import { Workspace, WorkspaceNodeType } from 'shared';
import { ChallengeCollection } from '../../collections/Challenge';
import { SubmissionCollection } from '../../collections/Submission';
import { WorkspaceCollection } from '../../collections/Workspace';
import {
  WorkspaceNodeCollection,
  WorkspaceNodeModel,
} from '../../collections/WorkspaceNode';
import { getWorkspaceNodeS3Key } from '../../common/helper';
import { createWorkspaceNodesFromSubmission } from '../../common/workspace-tree';
import { withTransaction } from '../../db';
import { createContract, createRpcBinding, s3 } from '../../lib';
import { getMappedWorkspace } from '../workspace/_common';

export const forkAnySubmission = createContract('submission.forkAnySubmission')
  .params('user', 'workspaceId', 'submissionId')

  .schema({
    user: S.object().appUser(),
    workspaceId: S.string().objectId(),
    submissionId: S.string().objectId(),
  })
  .returns<Workspace>()
  .fn(async (user, workspaceId, submissionId) => {
    const [workspace, submission] = await Promise.all([
      WorkspaceCollection.findByIdOrThrow(workspaceId),
      SubmissionCollection.findByIdOrThrow(submissionId),
    ]);
    const challenge = await ChallengeCollection.findByIdOrThrow(
      workspace.challengeId
    );

    let workspaceNodes: WorkspaceNodeModel[] = null!;
    await withTransaction(async () => {
      await WorkspaceNodeCollection.deleteMany({
        workspaceId,
      });
      workspaceNodes = createWorkspaceNodesFromSubmission(
        {
          workspaceId,
          userId: user._id,
        },
        challenge.files,
        submission.nodes
      );
      workspaceNodes.forEach(node => {
        node.s3Key = getWorkspaceNodeS3Key(node);
      });
      await WorkspaceNodeCollection.insertMany(workspaceNodes);
    });
    const files = workspaceNodes.filter(x => x.type === WorkspaceNodeType.File);

    await Promise.all(
      files.map(async file => {
        if (!file.sourceS3Key) {
          throw new Error('Expected sourceS3Key to be defined');
        }
        if (!file.s3Key) {
          throw new Error('Expected s3Key to be defined');
        }
        await s3
          .copyObject(
            {
              Bucket: config.aws.s3Bucket,
              CopySource: `/${config.aws.s3Bucket}/${file.sourceS3Key}`,
              Key: file.s3Key,
            },
            undefined
          )
          .promise();
      })
    );
    return getMappedWorkspace(workspace);
  });

export const forkAnySubmissionRpc = createRpcBinding({
  injectUser: true,
  signature: 'submission.forkAnySubmission',
  handler: forkAnySubmission,
});
