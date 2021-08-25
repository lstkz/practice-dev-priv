import { S } from 'schema';
import { createContract, createRpcBinding, s3 } from '../../lib';
import { config } from 'config';
import { getUserAvatarUploadKey } from '../../common/helper';
import { PresignedPost } from 'shared';
import { S3 } from 'aws-sdk';

async function _presignedPost(
  params: S3.PresignedPost.Params
): Promise<S3.PresignedPost> {
  return new Promise((resolve, reject) =>
    s3.createPresignedPost(params, (err, ret) => {
      if (err) {
        reject(err);
      } else {
        resolve(ret);
      }
    })
  );
}

export const getAvatarUploadUrl = createContract('user.getAvatarUploadUrl')
  .params('user')
  .schema({
    user: S.object().appUser(),
  })
  .returns<PresignedPost>()
  .fn(async user => {
    const uploadUrl = await _presignedPost({
      Bucket: config.aws.s3Bucket,
      Conditions: [['content-length-range', 0, 3 * 1024 * 1024]],
      Fields: {
        key: getUserAvatarUploadKey(user._id.toHexString()),
        'Content-Type': 'image/png',
      },
    });
    return {
      url: uploadUrl.url,
      fields: Object.keys(uploadUrl.fields).map(name => ({
        name,
        value: uploadUrl.fields[name],
      })),
    };
  });

export const getAvatarUploadUrlRpc = createRpcBinding({
  injectUser: true,
  signature: 'user.getAvatarUploadUrl',
  handler: getAvatarUploadUrl,
});
