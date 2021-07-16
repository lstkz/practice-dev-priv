import { S } from 'schema';
import { AuthData } from 'shared';
import { UserCollection } from '../../collections/User';
import { AppError } from '../../common/errors';
import { getEmail } from '../../common/google';
import { randomUniqString } from '../../common/helper';
import { createContract, createGraphqlBinding } from '../../lib';
import { createUser, generateAuthData, getNextUsername } from './_common';

export const registerGoogle = createContract('user.registerGoogle')
  .params('accessToken')
  .schema({
    accessToken: S.string(),
  })
  .returns<AuthData>()
  .fn(async accessToken => {
    const email = await getEmail(accessToken);
    const existing = await UserCollection.findOneByEmail(email);
    if (existing) {
      throw new AppError('User is already registered');
    }
    const user = await createUser(
      {
        email,
        username: await getNextUsername(email.split('@')[0]),
        password: randomUniqString(),
        isVerified: true,
      },
      true
    );
    return generateAuthData(user);
  });

export const registerGoogleGraphql = createGraphqlBinding({
  public: true,
  resolver: {
    Mutation: {
      registerGoogle: (_, { accessToken }) => registerGoogle(accessToken),
    },
  },
});
