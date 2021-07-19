import { S } from 'schema';
import { UserCollection } from '../../collections/User';
import { NotificationSettings } from '../../generated';
import { createContract, createGraphqlBinding } from '../../lib';

export const updateNotificationSettings = createContract(
  'user.updateNotificationSettings'
)
  .params('appUser', 'values')
  .schema({
    appUser: S.object().appUser(),
    values: S.object().keys({
      newsletter: S.boolean(),
    }),
  })
  .returns<NotificationSettings>()
  .fn(async (appUser, values) => {
    const user = await UserCollection.findByIdOrThrow(appUser.id);
    user.notificationSettings = values;
    await UserCollection.update(user, ['notificationSettings']);
    return values;
  });

export const updateNotificationSettingsGraphql = createGraphqlBinding({
  resolver: {
    Mutation: {
      updateNotificationSettings: (_, { values }, { getUser }) =>
        updateNotificationSettings(getUser(), values),
    },
  },
});
