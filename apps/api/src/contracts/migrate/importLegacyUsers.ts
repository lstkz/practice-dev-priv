import { ObjectID } from 'mongodb2';
import { S } from 'schema';
import fetch from 'cross-fetch';
import { LegacyUserEntity } from 'shared';
import { UserCollection, UserModel } from '../../collections/User';
import { createContract, createRpcBinding } from '../../lib';
import { uploadUserAvatar } from '../user/_common';
import { dispatchTask } from '../../dispatch';

export const importLegacyUsers = createContract('migrate.importLegacyUsers')
  .params('users')
  .schema({
    users: S.array().items(S.object().unknown().as<LegacyUserEntity>()),
  })
  .returns<void>()
  .fn(async users => {
    for (const user of users) {
      const mapped: UserModel = {
        _id: new ObjectID(),
        email: user.email,
        email_lowered: user.email.toLowerCase(),
        username: user.username,
        username_lowered: user.username.toLowerCase(),
        salt: user.salt,
        password: user.password,
        isVerified: user.isVerified,
        githubId: user.githubId,
        lastSeenAt: new Date(),
        registeredAt: new Date(),
        profile: {
          about: user.bio,
          country: user.country,
          name: user.name,
          url: user.url,
        },
        isImported: true,
        notificationSettings: {
          newsletter: user.isVerified,
        },
      };
      if (!mapped.githubId) {
        delete mapped.githubId;
      }
      if (user.avatarUrl) {
        const res = await fetch(
          `https://d3ia4clr21inua.cloudfront.net	
          /avatars/${user.avatarUrl}-org.png`
        );
        const imgBuffer = Buffer.from(await res.arrayBuffer());
        mapped.avatarId = await uploadUserAvatar(imgBuffer);
      }
      await UserCollection.insertOne(mapped);
      await dispatchTask({
        type: 'CreateEmailContact',
        payload: {
          email: mapped.email,
          subscribe: mapped.notificationSettings?.newsletter ?? false,
        },
      });
    }
  });

export const importLegacyUsersRpc = createRpcBinding({
  admin: true,
  signature: 'migrate.importLegacyUsers',
  handler: importLegacyUsers,
});
