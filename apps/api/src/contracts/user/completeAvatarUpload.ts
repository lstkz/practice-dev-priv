import { config } from 'config';
import { S } from 'schema';
import { AppError } from '../../common/errors';
import { getUserAvatarUploadKey } from '../../common/helper';
import { createContract, createRpcBinding, s3 } from '../../lib';
import { UserCollection } from '../../collections/User';
import { AvatarUploadResult } from 'shared';
import { uploadUserAvatar } from './_common';

export const completeAvatarUpload = createContract('user.completeAvatarUpload')
  .params('user')
  .schema({
    user: S.object().appUser(),
  })
  .returns<AvatarUploadResult>()
  .fn(async user => {
    const s3Object = await s3
      .getObject({
        Bucket: config.aws.s3Bucket,
        Key: getUserAvatarUploadKey(user._id.toHexString()),
      })
      .promise()
      .catch(err => {
        if (err.code === 'NotFound') {
          throw new AppError('File is not uploaded');
        }
        throw err;
      });
    if (!(s3Object.Body instanceof Buffer)) {
      throw new Error('Expected buffer');
    }
    const id = await uploadUserAvatar(s3Object.Body);
    user.avatarId = id;
    await UserCollection.update(user, ['avatarId']);
    return {
      avatarId: id,
    };
  });

export const completeAvatarUploadRpc = createRpcBinding({
  injectUser: true,
  signature: 'user.completeAvatarUpload',
  handler: completeAvatarUpload,
});
