import { S } from 'schema';
import { AuthData } from 'shared';
import { UserCollection } from '../../collections/User';
import { AppError } from '../../common/errors';
import { getEmail } from '../../common/google';
import { createContract, createGraphqlBinding } from '../../lib';
import { generateAuthData } from './_common';

export const loginGoogle = createContract('user.loginGoogle')
  .params('accessToken')
  .schema({
    accessToken: S.string(),
  })
  .returns<AuthData>()
  .fn(async accessToken => {
    const email = await getEmail(accessToken);
    const user = await UserCollection.findOneByEmail(email);
    if (!user) {
      throw new AppError('User is not registered');
    }
    return generateAuthData(user);
  });

export const loginGoogleGraphql = createGraphqlBinding({
  public: true,
  resolver: {
    Mutation: {
      loginGoogle: (_, { accessToken }) => loginGoogle(accessToken),
    },
  },
});
