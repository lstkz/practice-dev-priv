import { randomSalt, createPasswordHash } from '../../common/helper';
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
