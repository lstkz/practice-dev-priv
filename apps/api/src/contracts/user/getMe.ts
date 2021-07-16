import { S } from 'schema';
import { UserCollection } from '../../collections/User';
import { mapUser } from '../../common/mapper';
import { User } from '../../generated';
import { createContract, createGraphqlBinding } from '../../lib';

export const getMe = createContract('user.getMe')
  .params('user')
  .schema({
    user: S.object().appUser(),
  })
  .returns<User>()
  .fn(async user => {
    const userModal = await UserCollection.findByIdOrThrow(user.id);
    return mapUser(userModal);
  });

export const getMeGraphql = createGraphqlBinding({
  resolver: {
    Query: {
      me: (_, __, { getUser }) => getMe(getUser()),
    },
  },
});
