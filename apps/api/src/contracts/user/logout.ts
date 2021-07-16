import { S } from 'schema';
import { AccessTokenCollection } from '../../collections/AccessToken';
import { createContract, createGraphqlBinding } from '../../lib';

export const logout = createContract('user.logout')
  .params('token')
  .schema({
    token: S.string(),
  })
  .returns<void>()
  .fn(async token => {
    await AccessTokenCollection.deleteById(token);
  });

export const logoutGraphql = createGraphqlBinding({
  resolver: {
    Mutation: {
      logout: (_, __, { getToken }) => logout(getToken()),
    },
  },
});
