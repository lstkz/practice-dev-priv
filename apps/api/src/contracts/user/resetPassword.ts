import { S } from 'schema';
import { createContract, createRpcBinding } from '../../lib';
import { AppError } from '../../common/errors';
import { randomUniqString, getDuration } from '../../common/helper';
import { config } from 'config';
import { dispatchTask } from '../../dispatch';
import {
  ResetPasswordCodeCollection,
  ResetPasswordCodeModel,
} from '../../collections/ResetPasswordCode';
import { UserCollection } from '../../collections/User';

export const resetPassword = createContract('user.resetPassword')
  .params('usernameOrEmail')
  .schema({
    usernameOrEmail: S.string().trim(),
  })
  .returns<void>()
  .fn(async usernameOrEmail => {
    const user = await UserCollection.findOneByUsernameOrEmail(usernameOrEmail);
    if (!user) {
      throw new AppError('User not found');
    }
    const code = randomUniqString();
    const resetPasswordCode: ResetPasswordCodeModel = {
      _id: code,
      userId: user._id,
      expireAt: new Date(Date.now() + getDuration(1, 'd')),
    };
    await ResetPasswordCodeCollection.insertOne(resetPasswordCode);
    const url = `${config.appBaseUrl}/confirm-reset-password/${code}`;
    await dispatchTask({
      type: 'SendEmail',
      payload: {
        to: user.email,
        template: {
          type: 'actionButton',
          variables: {
            subject: 'Reset your password',
            title: 'Password reset.',
            link_text: 'Set new password',
            link_url: url,
            content: 'Click on the below link to confirm reset your password',
          },
        },
      },
    });
  });

export const resetPasswordRpc = createRpcBinding({
  public: true,
  signature: 'user.resetPassword',
  handler: resetPassword,
});
