import { S } from 'schema';
import { UserCollection } from '../../collections/User';
import { createContract, createGraphqlBinding } from '../../lib';

export const deleteAvatar = createContract('user.deleteAvatar')
  .params('appUser')
  .schema({
    appUser: S.object().appUser(),
  })
  .returns<void>()
  .fn(async appUser => {
    const user = await UserCollection.findByIdOrThrow(appUser.id);
    if (user.avatarId) {
      user.avatarId = null;
      await UserCollection.update(user, ['avatarId']);
      // TODO remove from s3?
    }
  });

export const deleteAvatarGraphql = createGraphqlBinding({
  resolver: {
    Mutation: {
      deleteAvatar: (_, __, { getUser }) => deleteAvatar(getUser()),
    },
  },
});
