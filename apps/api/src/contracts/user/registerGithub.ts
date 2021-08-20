import { S } from 'schema';
import fetch from 'cross-fetch';
import { AuthData } from 'shared';
import { UserCollection } from '../../collections/User';
import { reportError } from '../../common/bugsnag';
import { AppError } from '../../common/errors';
import { exchangeCode, getUserData } from '../../common/github';
import { countryNameToCode, randomUniqString } from '../../common/helper';
import { createContract, createRpcBinding } from '../../lib';
import {
  createUser,
  generateAuthData,
  getNextUsername,
  uploadUserAvatar,
} from './_common';

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
        profile: {
          about: githubData.bio,
          url: githubData.blog,
          name: githubData.name,
          country: countryNameToCode(githubData.location),
        },
      },
      true
    );
    if (githubData.avatar_url) {
      try {
        const img = await fetch(githubData.avatar_url).then(x =>
          x.arrayBuffer()
        );
        const id = await uploadUserAvatar(Buffer.from(img));
        user.avatarId = id;
        await UserCollection.update(user, ['avatarId']);
      } catch (e) {
        reportError({
          error: e,
          source: 'api',
          isHandled: true,
          data: { userId: user._id.toHexString() },
        });
      }
    }
    return generateAuthData(user);
  });

export const registerGithubRpc = createRpcBinding({
  public: true,
  signature: 'user.registerGithub',
  handler: registerGithub,
});
