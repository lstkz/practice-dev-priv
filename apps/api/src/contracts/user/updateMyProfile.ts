import { S } from 'schema';
import { countryList } from 'shared';
import { UserCollection, UserProfile } from '../../collections/User';
import { createContract, createGraphqlBinding } from '../../lib';

export const updateMyProfile = createContract('user.updateMyProfile')
  .params('appUser', 'values')
  .schema({
    appUser: S.object().appUser(),
    values: S.object().keys({
      name: S.string().optional().nullable().max(100),
      about: S.string().optional().nullable().max(500),
      country: S.enum()
        .optional()
        .nullable()
        .literal(...countryList.map(x => x.code)),
      url: S.string().optional().nullable().max(60),
    }),
  })
  .returns<UserProfile>()
  .fn(async (appUser, values) => {
    const user = await UserCollection.findByIdOrThrow(appUser.id);
    user.profile = values;
    await UserCollection.update(user, ['profile']);
    return values;
  });

export const updateMyProfileGraphql = createGraphqlBinding({
  resolver: {
    Mutation: {
      updateMyProfile: (_, { values }, { getUser }) =>
        updateMyProfile(getUser(), values),
    },
  },
});
