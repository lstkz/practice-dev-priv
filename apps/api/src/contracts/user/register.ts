import { S } from 'schema';
import { createContract, createRpcBinding } from '../../lib';
import { AuthData, getPasswordSchema, getUsernameSchema } from 'shared';
import { createUser, generateAuthData } from './_common';

export const register = createContract('user.register')
  .params('values')
  .schema({
    values: S.object().keys({
      email: S.string().email().trim(),
      username: getUsernameSchema(),
      password: getPasswordSchema(),
    }),
  })
  .returns<AuthData>()
  .fn(async values => {
    const user = await createUser(
      {
        ...values,
        isVerified: false,
      },
      true
    );
    return generateAuthData(user);
  });

export const loginGoogleRpc = createRpcBinding({
  public: true,
  signature: 'user.register',
  handler: register,
});
