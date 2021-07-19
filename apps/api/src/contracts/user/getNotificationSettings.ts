import { S } from 'schema';
import { UserCollection } from '../../collections/User';
import { NotificationSettings } from '../../generated';
import { createContract, createGraphqlBinding } from '../../lib';
import { updateNotificationSettings } from './updateNotificationSettings';

export const getNotificationSettings = createContract(
  'user.getNotificationSettings'
)
  .params('appUser')
  .schema({
    appUser: S.object().appUser(),
  })
  .returns<NotificationSettings>()
  .fn(async appUser => {
    const user = await UserCollection.findByIdOrThrow(appUser.id);
    if (!user.notificationSettings) {
      return updateNotificationSettings(appUser, {
        newsletter: true,
      });
    }
    return user.notificationSettings;
  });

export const getNotificationSettingsGraphql = createGraphqlBinding({
  resolver: {
    Query: {
      getNotificationSettings: (_, __, { getUser }) =>
        getNotificationSettings(getUser()),
    },
  },
});
