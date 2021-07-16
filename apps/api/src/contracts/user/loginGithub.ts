import { S } from 'schema';
import { AuthData } from 'shared';
import { UserCollection } from '../../collections/User';
import { AppError } from '../../common/errors';
import { exchangeCode, getUserData } from '../../common/github';
import { createContract, createGraphqlBinding } from '../../lib';
import { generateAuthData } from './_common';

export const loginGithub = createContract('user.loginGithub')
  .params('code')
  .schema({
    code: S.string(),
  })
  .returns<AuthData>()
  .fn(async code => {
    const accessToken = await exchangeCode(code);
    const githubData = await getUserData(accessToken);
    const user = await UserCollection.findOne({
      githubId: githubData.id,
    });
    if (!user) {
      throw new AppError('User is not registered');
    }
    return generateAuthData(user);
  });

export const loginGithubGraphql = createGraphqlBinding({
  public: true,
  resolver: {
    Mutation: {
      loginGithub: (_, { code }) => loginGithub(code),
    },
  },
});
