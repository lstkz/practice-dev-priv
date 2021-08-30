import { ObjectID } from 'mongodb';
import { S } from 'schema';
import { UserCollection } from '../../collections/User';
import { dispatchEvent, dispatchTask } from '../../dispatch';
import { createContract, createEventBinding } from '../../lib';
import { sendVerificationEmail } from './_common';

export const completeRegistration = createContract('user.completeRegistration')
  .params('userId')
  .schema({
    userId: S.string().objectId(),
  })
  .fn(async userId => {
    const user = await UserCollection.findByIdOrThrow(userId);
    if (!user.isVerified) {
      await sendVerificationEmail(user);
    } else {
      await dispatchEvent({
        type: 'UserEmailVerified',
        payload: {
          userId: userId.toHexString(),
        },
      });
    }
    await dispatchTask({
      type: 'CreateEmailContact',
      payload: {
        email: user.email,
        subscribe: false,
      },
    });
  });

export const completeRegistrationEvent = createEventBinding({
  type: 'UserRegistered',
  handler: async (_, event) => {
    await completeRegistration(ObjectID.createFromHexString(event.userId));
  },
});
