import { S } from 'schema';
import { UserProfile } from 'shared';
import { createContract, createRpcBinding } from '../../lib';

export const getMyProfile = createContract('user.getMyProfile')
  .params('user')
  .schema({
    user: S.object().appUser(),
  })
  .returns<UserProfile>()
  .fn(async user => {
    return user.profile ?? {};
  });

export const getMyProfileRpc = createRpcBinding({
  injectUser: true,
  signature: 'user.getMyProfile',
  handler: getMyProfile,
});
