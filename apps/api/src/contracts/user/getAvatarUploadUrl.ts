import { S } from 'schema';
import {
  createContract,
  createGraphqlBinding,
  createRpcBinding,
  s3,
} from '../../lib';
import { PresignedPost } from '../../generated';
import { config } from 'config';
import { getUserAvatarUploadKey } from '../../common/helper';

export const getAvatarUploadUrl = createContract('user.getAvatarUploadUrl')
  .params('user')
  .schema({
    user: S.object().appUser(),
  })
  .returns<PresignedPost>()
  .fn(async user => {
    const uploadUrl = await s3.createPresignedPost({
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

export const getAvatarUploadUrlGraphql = createGraphqlBinding({
  resolver: {
    Query: {
      getAvatarUploadUrl: (_, __, { getUser }) => getAvatarUploadUrl(getUser()),
    },
  },
});

export const getAvatarUploadUrlRpc = createRpcBinding({
  injectUser: true,
  signature: 'user.getAvatarUploadUrl',
  handler: getAvatarUploadUrl,
});
