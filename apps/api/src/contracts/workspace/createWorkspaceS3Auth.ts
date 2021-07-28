import { config } from 'config';
import { S } from 'schema';
import { WorkspaceS3Auth } from '../../collections/Workspace';
import { getDuration, getWorkspaceS3Prefix } from '../../common/helper';
import { createContract, sts } from '../../lib';

export const createWorkspaceS3Auth = createContract(
  'workspace.createWorkspaceS3Auth'
)
  .params('workspaceId')
  .schema({
    workspaceId: S.string().objectId(),
  })
  .returns<WorkspaceS3Auth>()
  .fn(async workspaceId => {
    const baseArn = 'arn:aws:s3:::' + config.aws.s3Bucket;
    const resource = `${baseArn}/${getWorkspaceS3Prefix(workspaceId)}*`;
    const ret = await sts
      .getFederationToken(
        {
          Name: 'file-upload',
          DurationSeconds:
            getDuration(config.workspace.expirationHours, 'h') * 60 * 60,
          Policy: JSON.stringify(
            {
              Version: '2012-10-17',
              Statement: [
                {
                  Action: ['s3:PutObject', 's3:DeleteObject'],
                  Effect: 'Allow',
                  Resource: [resource],
                },
              ],
            },
            null,
            2
          ),
        },
        undefined
      )
      .promise();

    return {
      bucketName: config.aws.s3Bucket,
      credentials: {
        accessKeyId: ret.Credentials!.AccessKeyId,
        secretAccessKey: ret.Credentials!.SecretAccessKey,
        sessionToken: ret.Credentials!.SessionToken,
      },
      credentialsExpiresAt: new Date(
        Date.now() + getDuration(config.workspace.expirationHours - 0.5, 'h')
      ),
    };
  });
