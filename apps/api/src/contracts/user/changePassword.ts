import { S } from 'schema';
import { getPasswordSchema } from 'shared';
import { UserCollection } from '../../collections/User';
import { createPasswordHash } from '../../common/helper';
import { createContract, createGraphqlBinding } from '../../lib';

export const changePassword = createContract('user.changePassword')
  .params('appUser', 'password')
  .schema({
    appUser: S.object().appUser(),
    password: getPasswordSchema(),
  })
  .returns<void>()
  .fn(async (appUser, password) => {
    const user = await UserCollection.findByIdOrThrow(appUser.id);
    const hash = await createPasswordHash(password, user.salt);
    user.password = hash;
    await UserCollection.update(user, ['password']);
  });

export const changePasswordGraphql = createGraphqlBinding({
  resolver: {
    Mutation: {
      changePassword: (_, { password }, { getUser }) =>
        changePassword(getUser(), password),
    },
  },
});
