import { S } from 'schema';
import { UserCollection } from '../../collections/User';
import { createContract, createRpcBinding } from '../../lib';

export const deleteAvatar = createContract('user.deleteAvatar')
  .params('user')
  .schema({
    user: S.object().appUser(),
  })
  .returns<void>()
  .fn(async user => {
    if (user.avatarId) {
      user.avatarId = null;
      await UserCollection.update(user, ['avatarId']);
      // TODO remove from s3?
    }
  });

export const deleteAvatarRpc = createRpcBinding({
  injectUser: true,
  signature: 'user.deleteAvatar',
  handler: deleteAvatar,
});
