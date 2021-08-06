import { S } from 'schema';
import { countryList, URL_REGEX } from 'shared';
import { UserCollection, UserProfile } from '../../collections/User';
import { createContract, createRpcBinding } from '../../lib';

export const updateMyProfile = createContract('user.updateMyProfile')
  .params('user', 'values')
  .schema({
    user: S.object().appUser(),
    values: S.object().keys({
      name: S.string().optional().nullable().max(100),
      about: S.string().optional().nullable().max(500),
      country: S.enum()
        .optional()
        .nullable()
        .literal(...countryList.map(x => x.code)),
      url: S.string().regex(URL_REGEX).optional().nullable().max(60),
    }),
  })
  .returns<UserProfile>()
  .fn(async (user, values) => {
    user.profile = values;
    await UserCollection.update(user, ['profile']);
    return values;
  });

export const resetPasswordRpc = createRpcBinding({
  injectUser: true,
  signature: 'user.updateMyProfile',
  handler: updateMyProfile,
});
