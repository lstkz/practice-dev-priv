import { S } from 'schema';
import { getPasswordSchema } from 'shared';
import { UserCollection } from '../../collections/User';
import { createPasswordHash } from '../../common/helper';
import { createContract, createRpcBinding } from '../../lib';

export const changePassword = createContract('user.changePassword')
  .params('user', 'password')
  .schema({
    user: S.object().appUser(),
    password: getPasswordSchema(),
  })
  .returns<void>()
  .fn(async (user, password) => {
    const hash = await createPasswordHash(password, user.salt);
    user.password = hash;
    await UserCollection.update(user, ['password']);
  });

export const changeEmailRpc = createRpcBinding({
  injectUser: true,
  signature: 'user.changePassword',
  handler: changePassword,
});
