import { config } from 'config';
import { S } from 'schema';
import jimp from 'jimp';
import { AppError } from '../../common/errors';
import {
  doFn,
  getUserAvatarUploadKey,
  randomString,
} from '../../common/helper';
import { AvatarUploadResult } from '../../generated';
import { createContract, createGraphqlBinding, s3 } from '../../lib';
import { UserCollection } from '../../collections/User';

export const completeAvatarUpload = createContract('user.completeAvatarUpload')
  .params('appUser')
  .schema({
    appUser: S.object().appUser(),
  })
  .returns<AvatarUploadResult>()
  .fn(async appUser => {
    const s3Object = await s3
      .getObject({
        Bucket: config.aws.s3Bucket,
        Key: getUserAvatarUploadKey(appUser.id.toHexString()),
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
    const img = await jimp.read(s3Object.Body).catch(() => {
      throw new AppError('Uploaded file is not a valid image');
    });
    if (img.bitmap.width !== img.bitmap.height) {
      throw new AppError('Image must be square');
    }
    const getPath = (size: string) => `cdn/avatars/${id}-${size}.png`;
    const id = randomString(20);
    await Promise.all([
      doFn(async () => {
        await s3
          .upload({
            Bucket: config.aws.s3Bucket,
            Key: getPath('org'),
            Body: await img.clone().getBufferAsync('image/png'),
          })
          .promise();
      }),
      doFn(async () => {
        await s3
          .upload({
            Bucket: config.aws.s3Bucket,
            Key: getPath('280x280'),
            Body: await img
              .clone()
              .resize(280, 280)
              .getBufferAsync('image/png'),
          })
          .promise();
      }),
      doFn(async () => {
        await s3
          .upload({
            Bucket: config.aws.s3Bucket,
            Key: getPath('80x80'),
            Body: await img.clone().resize(80, 80).getBufferAsync('image/png'),
          })
          .promise();
      }),
    ]);
    const user = await UserCollection.findByIdOrThrow(appUser.id);
    user.avatarId = id;
    await UserCollection.update(user, ['avatarId']);
    return {
      avatarId: id,
    };
  });

export const completeAvatarUploadGraphql = createGraphqlBinding({
  resolver: {
    Mutation: {
      completeAvatarUpload: (_, __, { getUser }) =>
        completeAvatarUpload(getUser()),
    },
  },
});
