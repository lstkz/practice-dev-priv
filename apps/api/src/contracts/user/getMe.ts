import { S } from 'schema';
import { User } from 'shared';
import * as DateFns from 'date-fns';
import { mapUser } from '../../common/mapper';
import { createContract, createRpcBinding } from '../../lib';
import { UserCollection } from '../../collections/User';
import { getCurrentDate } from '../../common/helper';

export const getMe = createContract('user.getMe')
  .params('user')
  .schema({
    user: S.object().appUser(),
  })
  .returns<User>()
  .fn(async user => {
    if (
      !user.lastSeenAt ||
      DateFns.differenceInHours(getCurrentDate(), user.lastSeenAt) >= 1
    ) {
      user.lastSeenAt = getCurrentDate();
      await UserCollection.update(user, ['lastSeenAt']);
    }
    return mapUser(user);
  });

export const getMeRpc = createRpcBinding({
  injectUser: true,
  signature: 'user.getMe',
  handler: getMe,
});
