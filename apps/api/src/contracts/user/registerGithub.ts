import { S } from 'schema';
import { AuthData } from 'shared';
import { UserCollection } from '../../collections/User';
import { AppError } from '../../common/errors';
import { exchangeCode, getUserData } from '../../common/github';
import { randomUniqString } from '../../common/helper';
import { createContract, createGraphqlBinding } from '../../lib';
import { createUser, generateAuthData, getNextUsername } from './_common';

export const registerGithub = createContract('user.registerGithub')
  .params('code')
  .schema({
    code: S.string(),
  })
  .returns<AuthData>()
  .fn(async code => {
    const accessToken = await exchangeCode(code);
    const githubData = await getUserData(accessToken);
    const githubUser = await UserCollection.findOne({
      githubId: githubData.id,
    });
    if (githubUser) {
      throw new AppError('User is already registered');
    }
    const user = await createUser(
      {
        email: githubData.email,
        githubId: githubData.id,
        username: await getNextUsername(githubData.username),
        password: randomUniqString(),
        isVerified: true,
      },
      true
    );
    return generateAuthData(user);
  });

export const registerGithubGraphql = createGraphqlBinding({
  public: true,
  resolver: {
    Mutation: {
      registerGithub: (_, { code }) => registerGithub(code),
    },
  },
});
