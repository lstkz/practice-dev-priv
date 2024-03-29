import {
  randomSalt,
  createPasswordHash,
  randomInt,
  randomUniqString,
  getCurrentDate,
  doFn,
  randomString,
} from '../../common/helper';
import jimp from 'jimp';
import { UserCollection, UserModel } from '../../collections/User';
import { ObjectID } from 'mongodb';
import { config } from 'config';
import { AppError, UnauthorizedError } from '../../common/errors';
import { dispatchEvent, dispatchTask } from '../../dispatch';
import { AuthData, UserProfile } from 'shared';
import { mapUser } from '../../common/mapper';
import { createToken } from './createToken';
import {
  ConfirmEmailCodeCollection,
  ConfirmEmailCodeModel,
} from '../../collections/ConfirmEmailCode';
import { AppUser } from '../../types';
import { AccessTokenCollection } from '../../collections/AccessToken';
import { s3 } from '../../lib';

interface CreateUserValues {
  userId?: ObjectID;
  email: string;
  username: string;
  password: string;
  isVerified: boolean;
  githubId?: number;
  lastSeenAt?: Date;
  registeredAt?: Date;
  profile?: UserProfile;
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
    lastSeenAt: values.lastSeenAt ?? getCurrentDate(),
    registeredAt: values.registeredAt ?? getCurrentDate(),
    profile: values.profile,
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
  const MAX_TRIES = 100;
  const getUsername = (i: number) => {
    if (i < MAX_TRIES / 2) {
      return i === 1 ? username : `${username}${i}`;
    }
    return `user${randomInt() % 1e6}`;
  };
  for (let i = 1; i < MAX_TRIES; i++) {
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

export async function sendVerificationEmail(user: UserModel) {
  const code = randomUniqString();
  const confirmEmailCode: ConfirmEmailCodeModel = {
    _id: code,
    userId: user._id,
  };
  await ConfirmEmailCodeCollection.insertOne(confirmEmailCode);
  const confirmLink = `${config.appBaseUrl}?confirm-email=${code}`;
  await dispatchTask({
    type: 'SendEmail',
    payload: {
      to: user.email,
      template: {
        type: 'actionButton',
        variables: {
          subject: '👋 Confirm your email',
          title: 'Almost done.',
          link_text: 'Confirm',
          link_url: confirmLink,
          content:
            'One more step. Click on the below link to confirm your email.',
        },
      },
    },
  });
}

export async function getAppUser(token: string): Promise<AppUser> {
  const tokenEntity = await AccessTokenCollection.findOne({
    _id: token,
  });
  if (!tokenEntity) {
    throw new UnauthorizedError('invalid token');
  }
  const ret = await UserCollection.findByIdOrThrow(tokenEntity.userId);
  return {
    ...ret,
    accessToken: token,
  };
}

export async function uploadUserAvatar(imgBuffer: Buffer) {
  const img = await jimp.read(imgBuffer).catch(() => {
    throw new AppError('Uploaded file is not a valid image');
  });
  if (img.bitmap.width !== img.bitmap.height) {
    throw new AppError('Image must be square');
  }
  const getPath = (size: string) => `cdn/avatars/${id}-${size}.png`;
  const id = randomString(20);
  await Promise.all([
    doFn(async () => {
      await s3
        .upload({
          Bucket: config.aws.s3Bucket,
          Key: getPath('org'),
          Body: await img.clone().getBufferAsync('image/png'),
        })
        .promise();
    }),
    doFn(async () => {
      await s3
        .upload({
          Bucket: config.aws.s3Bucket,
          Key: getPath('280x280'),
          Body: await img.clone().resize(280, 280).getBufferAsync('image/png'),
        })
        .promise();
    }),
    doFn(async () => {
      await s3
        .upload({
          Bucket: config.aws.s3Bucket,
          Key: getPath('80x80'),
          Body: await img.clone().resize(80, 80).getBufferAsync('image/png'),
        })
        .promise();
    }),
  ]);
  return id;
}
