import { S } from 'schema';
import { createContract, createRpcBinding } from '../../lib';
import { AppError } from '../../common/errors';
import { createPasswordHash } from '../../common/helper';
import { AuthData, getPasswordSchema } from 'shared';
import { ResetPasswordCodeCollection } from '../../collections/ResetPasswordCode';
import { UserCollection } from '../../collections/User';
import { withTransaction } from '../../db';
import { generateAuthData } from './_common';

export const confirmResetPassword = createContract('user.confirmResetPassword')
  .params('code', 'newPassword')
  .schema({
    code: S.string(),
    newPassword: getPasswordSchema(),
  })
  .returns<AuthData>()
  .fn(async (code, newPassword) => {
    const resetCode = await ResetPasswordCodeCollection.findById(code);
    if (!resetCode) {
      throw new AppError('Invalid or used reset code');
    }
    if (resetCode.expireAt.getTime() < Date.now()) {
      throw new AppError('Expired code. Please request password reset again.');
    }
    const user = await UserCollection.findByIdOrThrow(resetCode.userId);
    const hashedPassword = await createPasswordHash(newPassword, user.salt);
    user.password = hashedPassword;
    await withTransaction(async () => {
      await UserCollection.update(user, ['password']);
      await ResetPasswordCodeCollection.deleteById(code);
    });
    return generateAuthData(user);
  });

export const changeEmailRpc = createRpcBinding({
  public: true,
  signature: 'user.confirmResetPassword',
  handler: confirmResetPassword,
});
