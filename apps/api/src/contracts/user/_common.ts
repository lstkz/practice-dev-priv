import { randomSalt, createPasswordHash, randomInt } from '../../common/helper';
import { UserCollection, UserModel } from '../../collections/User';
import { ObjectID } from 'mongodb';
import { AppError } from '../../common/errors';
import { dispatchEvent } from '../../dispatch';
import { AuthData } from 'shared';
import { mapUser } from '../../common/mapper';
import { createToken } from './createToken';

interface CreateUserValues {
  userId?: ObjectID;
  email: string;
  username: string;
  password: string;
  isVerified: boolean;
  githubId?: number;
  subscribeNewsletter?: boolean;
}

export async function createUser(
  values: CreateUserValues,
  publishEvents = false
) {
  const userId = values.userId || new ObjectID();
  const salt = await randomSalt();
  const password = await createPasswordHash(values.password, salt);
  const user: UserModel = {
    _id: userId,
    email: values.email,
    email_lowered: values.email.toLowerCase(),
    username: values.username,
    username_lowered: values.username.toLowerCase(),
    salt,
    password,
    isVerified: values.isVerified,
    githubId: values.githubId,
  };
  if (!user.githubId) {
    delete user.githubId;
  }
  if (await UserCollection.findOneByEmail(values.email)) {
    throw new AppError('Email already registered');
  }
  if (await UserCollection.findOneByUsername(values.username)) {
    throw new AppError('Username already taken');
  }
  await UserCollection.insertOne(user);
  if (publishEvents) {
    await dispatchEvent({
      type: 'UserRegistered',
      payload: {
        userId: user._id.toHexString(),
      },
    });
  }
  return user;
}

export async function generateAuthData(user: UserModel): Promise<AuthData> {
  return {
    user: mapUser(user),
    token: await createToken(user._id, null),
  };
}

export async function getNextUsername(username: string) {
  const getUsername = (i: number) => {
    if (i < 50) {
      return i === 1 ? username : `${username}${i}`;
    }
    return `user${randomInt() % 1e6}`;
  };
  for (let i = 1; i < 50; i++) {
    const targetUsername = getUsername(i);
    const count = await UserCollection.countDocuments({
      username_lowered: targetUsername,
    });
    if (!count) {
      return targetUsername;
    }
  }
  throw new Error('Cannot generate username for: ' + username);
}
