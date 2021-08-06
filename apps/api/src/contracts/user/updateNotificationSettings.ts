import { S } from 'schema';
import { NotificationSettings } from 'shared';
import { UserCollection } from '../../collections/User';
import { createContract, createRpcBinding } from '../../lib';

export const updateNotificationSettings = createContract(
  'user.updateNotificationSettings'
)
  .params('user', 'values')
  .schema({
    user: S.object().appUser(),
    values: S.object().keys({
      newsletter: S.boolean(),
    }),
  })
  .returns<NotificationSettings>()
  .fn(async (user, values) => {
    user.notificationSettings = values;
    await UserCollection.update(user, ['notificationSettings']);
    return values;
  });

export const resetPasswordRpc = createRpcBinding({
  injectUser: true,
  signature: 'user.updateNotificationSettings',
  handler: updateNotificationSettings,
});
