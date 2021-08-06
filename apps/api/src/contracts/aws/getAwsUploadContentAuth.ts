import { config } from 'config';
import { AwsUploadContentAuth } from 'shared';
import { createContract, createRpcBinding, sts } from '../../lib';

export const getAwsUploadContentAuth = createContract(
  'aws.getAwsUploadContentAuth'
)
  .params()
  .returns<AwsUploadContentAuth>()
  .fn(async () => {
    const baseArn = 'arn:aws:s3:::' + config.aws.s3Bucket;
    const ret = await sts
      .getFederationToken(
        {
          Name: 'content-upload',
          Policy: JSON.stringify(
            {
              Version: '2012-10-17',
              Statement: [
                {
                  Action: ['s3:*'],
                  Effect: 'Allow',
                  Resource: [baseArn, baseArn + '/*'],
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
    };
  });

export const getAwsUploadContentAuthRpc = createRpcBinding({
  admin: true,
  signature: 'aws.getAwsUploadContentAuth',
  handler: getAwsUploadContentAuth,
});
