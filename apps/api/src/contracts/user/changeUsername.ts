import { S } from 'schema';
import { getUsernameSchema } from '../../../../../packages/shared';
import { UserCollection } from '../../collections/User';
import { AppError } from '../../common/errors';
import { createContract, createRpcBinding } from '../../lib';

export const changeUsername = createContract('user.changeUsername')
  .params('user', 'username')
  .schema({
    user: S.object().appUser(),
    username: getUsernameSchema(),
  })
  .returns<void>()
  .fn(async (user, username) => {
    if (user.username.toLowerCase() !== username.toLowerCase()) {
      const existing = await UserCollection.findOneByUsername(username);
      if (existing) {
        throw new AppError('Username already taken');
      }
    }
    user.username = username;
    user.username_lowered = username.toLowerCase();
    await UserCollection.update(user, ['username', 'username_lowered']);
  });

export const changeUsernameRpc = createRpcBinding({
  injectUser: true,
  signature: 'user.changeUsername',
  handler: changeUsername,
});
