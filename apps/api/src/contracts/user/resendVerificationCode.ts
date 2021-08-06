import { S } from 'schema';
import { AppError } from '../../common/errors';
import { createContract, createRpcBinding } from '../../lib';
import { sendVerificationEmail } from './_common';

export const resendVerificationCode = createContract(
  'user.resendVerificationCode'
)
  .params('user')
  .schema({
    user: S.object().appUser(),
  })
  .returns<void>()
  .fn(async user => {
    if (user.isVerified) {
      throw new AppError('User is already verified');
    }
    await sendVerificationEmail(user);
  });

export const resendVerificationCodeRpc = createRpcBinding({
  injectUser: true,
  signature: 'user.resendVerificationCode',
  handler: resendVerificationCode,
});
