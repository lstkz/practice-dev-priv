import { S } from 'schema';
import * as DateFns from 'date-fns';
import { ConfirmEmailChangeCollection } from '../../collections/ConfirmEmailChange';
import { UserCollection } from '../../collections/User';
import { AppError } from '../../common/errors';
import { randomUniqString } from '../../common/helper';
import { createContract, createRpcBinding } from '../../lib';
import { config } from 'config';
import { dispatchTask } from '../../dispatch';
import { OkResult } from 'shared';

export const changeEmail = createContract('user.changeEmail')
  .params('user', 'newEmail')
  .schema({
    user: S.object().appUser(),
    newEmail: S.string().email(),
  })
  .returns<OkResult>()
  .fn(async (user, newEmail) => {
    if (user.email_lowered === newEmail.toLowerCase()) {
      user.email = newEmail;
      await UserCollection.update(user, ['email']);
      return {
        ok: false,
      };
    }
    const existing = await UserCollection.findOneByEmail(newEmail);
    if (existing) {
      throw new AppError('Email is already taken');
    }
    const code = randomUniqString();
    await ConfirmEmailChangeCollection.insertOne({
      _id: code,
      newEmail,
      userId: user._id,
      expireAt: DateFns.addDays(new Date(), 1),
    });
    const confirmLink = `${config.appBaseUrl}?confirm-new-email=${code}`;
    await dispatchTask({
      type: 'SendEmail',
      payload: {
        to: newEmail,
        template: {
          type: 'actionButton',
          variables: {
            subject: 'Confirm your new email.',
            title: 'New email.',
            content:
              'Please click on the link below to confirm your new email. A link will be valid only for 24 hours.',
            link_text: 'Confirm',
            link_url: confirmLink,
          },
        },
      },
    });
    return {
      ok: true,
    };
  });

export const changeEmailRpc = createRpcBinding({
  injectUser: true,
  signature: 'user.changeEmail',
  handler: changeEmail,
});
