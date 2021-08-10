import { S } from 'schema';
import { ObjectID } from 'mongodb2';
import { createContract, createTaskBinding, s3 } from '../../lib';
import { SubmissionCollection } from '../../collections/Submission';
import { config } from 'config';
import {
  getSubmissionNodeS3Key,
  getWorkspaceS3Prefix,
} from '../../common/helper';
import { WorkspaceNodeType } from 'shared';

export const cloneWorkspaceFiles = createContract(
  'submission.cloneWorkspaceFiles'
)
  .params('submissionId')
  .schema({
    submissionId: S.string().objectId(),
  })
  .fn(async submissionId => {
    const submission = await SubmissionCollection.findByIdOrThrow(submissionId);
    await Promise.all(
      submission.nodes.map(async node => {
        if (node.s3Key || node.type === WorkspaceNodeType.Directory) {
          return;
        }
        node.s3Key = getSubmissionNodeS3Key(submissionId, node);
        await s3
          .copyObject(
            {
              Bucket: config.aws.s3Bucket,
              CopySource: `/${config.aws.s3Bucket}/${getWorkspaceS3Prefix(
                submission.workspaceId
              )}${node._id}`,
              Key: node.s3Key,
            },
            undefined
          )
          .promise();
      })
    );
    submission.isCloned = true;
    await SubmissionCollection.update(submission, ['nodes', 'isCloned']);
  });

export const cloneWorkspaceFilesTask = createTaskBinding({
  type: 'CloneWorkspaceFiles',
  handler: async (_, task) => {
    await cloneWorkspaceFiles(ObjectID.createFromHexString(task.submissionId));
  },
});
