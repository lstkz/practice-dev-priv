import { S } from 'schema';
import { ObjectID } from 'mongodb2';
import { createContract, createTaskBinding, s3 } from '../../lib';
import { SubmissionCollection } from '../../collections/Submission';
import { config } from 'config';
import { getSubmissionNodeS3Key } from '../../common/helper';
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
        if (!node.sourceS3Key) {
          throw new Error('Expected sourceS3Key');
        }
        node.s3Key = getSubmissionNodeS3Key(submissionId, node);
        await s3
          .copyObject(
            {
              Bucket: config.aws.s3Bucket,
              CopySource: `/${config.aws.s3Bucket}/${node.sourceS3Key}`,
              Key: node.s3Key,
            },
            undefined
          )
          .promise();
      })
    );
    await SubmissionCollection.update(submission, ['nodes']);
  });

export const cloneWorkspaceFilesTask = createTaskBinding({
  type: 'CloneWorkspaceFiles',
  handler: async (_, task) => {
    await cloneWorkspaceFiles(ObjectID.createFromHexString(task.submissionId));
  },
});
