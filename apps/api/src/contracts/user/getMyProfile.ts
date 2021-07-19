import { S } from 'schema';
import { UserCollection, UserProfile } from '../../collections/User';
import { createContract, createGraphqlBinding } from '../../lib';

export const getMyProfile = createContract('user.getMyProfile')
  .params('user')
  .schema({
    user: S.object().appUser(),
  })
  .returns<UserProfile>()
  .fn(async user => {
    const latest = await UserCollection.findByIdOrThrow(user.id);
    return latest.profile ?? {};
  });

export const getMyProfileGraphql = createGraphqlBinding({
  resolver: {
    Query: {
      getMyProfile: (_, __, { getUser }) => getMyProfile(getUser()),
    },
  },
});
