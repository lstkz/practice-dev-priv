import { config } from 'config';
import { ObjectID } from 'mongodb';
import { S } from 'schema';
import {
  ConfirmEmailCodeCollection,
  ConfirmEmailCodeModel,
} from '../../collections/ConfirmEmailCode';
import { UserCollection } from '../../collections/User';
import { randomUniqString } from '../../common/helper';
import { dispatchTask, dispatchEvent } from '../../dispatch';
import { createContract, createEventBinding } from '../../lib';

export const completeRegistration = createContract('user.completeRegistration')
  .params('userId')
  .schema({
    userId: S.string().objectId(),
  })
  .fn(async userId => {
    const user = await UserCollection.findByIdOrThrow(userId);
    if (!user.isVerified) {
      const code = randomUniqString();
      const confirmEmailCode: ConfirmEmailCodeModel = {
        _id: code,
        userId,
      };
      await ConfirmEmailCodeCollection.insertOne(confirmEmailCode);
      const confirmLink = `${config.appBaseUrl}?confirm-email=${code}`;
      await dispatchTask({
        type: 'SendEmail',
        payload: {
          to: user.email,
          template: {
            type: 'actionButton',
            variables: {
              subject: '👋 Confirm your email',
              title: 'Almost done.',
              link_text: 'Confirm',
              link_url: confirmLink,
              content:
                'One more step. Click on the below link to confirm your email.',
            },
          },
        },
      });
    } else {
      await dispatchEvent({
        type: 'UserEmailVerified',
        payload: {
          userId: userId.toHexString(),
        },
      });
    }
  });

export const completeRegistrationEvent = createEventBinding({
  type: 'UserRegistered',
  handler: async (_, event) => {
    await completeRegistration(ObjectID.createFromHexString(event.userId));
  },
});
