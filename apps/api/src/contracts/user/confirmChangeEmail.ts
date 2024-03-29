import { S } from 'schema';
import { ConfirmEmailChangeCollection } from '../../collections/ConfirmEmailChange';
import { UserCollection } from '../../collections/User';
import { AppError } from '../../common/errors';
import { dispatchEvent } from '../../dispatch';
import { createContract, createRpcBinding } from '../../lib';

export const confirmChangeEmail = createContract('user.confirmChangeEmail')
  .params('user', 'code')
  .schema({
    user: S.object().appUser(),
    code: S.string(),
  })
  .returns<void>()
  .fn(async (user, code) => {
    const emailChange = await ConfirmEmailChangeCollection.findById(code);
    if (!emailChange) {
      throw new AppError('Invalid code');
    }
    if (!emailChange.userId.equals(user._id)) {
      throw new AppError('Invalid code');
    }
    if (emailChange.expireAt.getTime() < Date.now()) {
      throw new AppError('Token expired. Please request email change again.');
    }
    if (emailChange.isUsed) {
      throw new AppError('You have already confirmed the new email.');
    }
    const existing = await UserCollection.findOneByEmail(emailChange.newEmail);
    if (existing) {
      throw new AppError('Cannot change email. Email taken by another user.');
    }
    user.email = emailChange.newEmail;
    user.email_lowered = emailChange.newEmail.toLowerCase();
    user.isVerified = true;
    await UserCollection.update(user, ['email', 'email_lowered', 'isVerified']);
    emailChange.isUsed = true;
    await ConfirmEmailChangeCollection.update(emailChange, ['isUsed']);
    await dispatchEvent({
      type: 'UserEmailUpdated',
      payload: {
        userId: user._id.toHexString(),
      },
    });
  });

export const changeEmailRpc = createRpcBinding({
  injectUser: true,
  signature: 'user.confirmChangeEmail',
  handler: confirmChangeEmail,
});
