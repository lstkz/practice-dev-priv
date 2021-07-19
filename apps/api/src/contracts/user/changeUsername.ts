import { S } from 'schema';
import { getUsernameSchema } from '../../../../../packages/shared';
import { UserCollection } from '../../collections/User';
import { AppError } from '../../common/errors';
import { createContract, createGraphqlBinding } from '../../lib';

export const changeUsername = createContract('user.changeUsername')
  .params('appUser', 'username')
  .schema({
    appUser: S.object().appUser(),
    username: getUsernameSchema(),
  })
  .returns<void>()
  .fn(async (appUser, username) => {
    const user = await UserCollection.findByIdOrThrow(appUser.id);
    const existing = await UserCollection.findOneByUsername(username);
    if (existing) {
      throw new AppError('Username already taken');
    }
    user.username = username;
    user.username_lowered = username.toLowerCase();
    await UserCollection.update(user, ['username', 'username_lowered']);
  });

export const changeUsernameGraphql = createGraphqlBinding({
  resolver: {
    Mutation: {
      changeUsername: (_, { username }, { getUser }) =>
        changeUsername(getUser(), username),
    },
  },
});
