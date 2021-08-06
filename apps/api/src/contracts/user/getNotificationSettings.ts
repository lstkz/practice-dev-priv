import { S } from 'schema';
import { NotificationSettings } from 'shared';
import { createContract, createRpcBinding } from '../../lib';
import { updateNotificationSettings } from './updateNotificationSettings';

export const getNotificationSettings = createContract(
  'user.getNotificationSettings'
)
  .params('user')
  .schema({
    user: S.object().appUser(),
  })
  .returns<NotificationSettings>()
  .fn(async user => {
    if (!user.notificationSettings) {
      return updateNotificationSettings(user, {
        newsletter: true,
      });
    }
    return user.notificationSettings;
  });

export const getNotificationSettingsRpc = createRpcBinding({
  injectUser: true,
  signature: 'user.getNotificationSettings',
  handler: getNotificationSettings,
});
