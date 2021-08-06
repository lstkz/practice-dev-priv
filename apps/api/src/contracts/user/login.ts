import { S } from 'schema';
import { AuthData } from 'shared';
import { UserCollection } from '../../collections/User';
import { AppError } from '../../common/errors';
import { createPasswordHash } from '../../common/helper';
import { createContract, createRpcBinding } from '../../lib';
import { generateAuthData } from './_common';

const INVALID_CRED = 'Invalid credentials or user not found';

export const login = createContract('user.login')
  .params('values')
  .schema({
    values: S.object().keys({
      usernameOrEmail: S.string().trim(),
      password: S.string(),
    }),
  })
  .returns<AuthData>()
  .fn(async values => {
    const user = await UserCollection.findOneByUsernameOrEmail(
      values.usernameOrEmail
    );
    if (!user) {
      throw new AppError(INVALID_CRED);
    }
    const hash = await createPasswordHash(values.password, user.salt);
    if (user.password !== hash) {
      throw new AppError(INVALID_CRED);
    }
    return generateAuthData(user);
  });

export const loginRpc = createRpcBinding({
  public: true,
  signature: 'user.login',
  handler: login,
});
