import { ObjectID } from 'mongodb';
import bcrypt from 'bcryptjs';
import * as DateFns from 'date-fns';
import { ValidationError } from 'apollo-server-errors';
import { UserCollection, UserModel } from '../collections/User';
import { AuthResult } from '../generated';
import { Resolvers } from '../types';
import { randomUniqString, sendEmail } from '../common/helper';
import {
  AccessTokenCollection,
  AccessTokenModel,
} from '../collections/AccessToken';
import { AuthenticationError, toApolloError } from 'apollo-server';
import { mapUser } from '../common/mapper';
import * as z from 'zod';
import {
  ResetPasswordCodeCollection,
  ResetPasswordCodeModel,
} from '../collections/ResetPasswordCode';
import { config } from 'config';

async function _createAuthData(user: UserModel): Promise<AuthResult> {
  const accessToken: AccessTokenModel = {
    _id: randomUniqString(),
    userId: user._id,
  };
  await AccessTokenCollection.insertOne(accessToken);
  return {
    token: accessToken._id,
    user: mapUser(user),
  };
}

function _validate<T>(schema: z.ZodObject<any, any, T>, input: T) {
  try {
    schema.parse(input);
  } catch (e: any) {
    throw toApolloError(e, 'VALIDATION_ERROR');
  }
}

async function _hashPassword(password: string) {
  return await bcrypt.hash(password, await bcrypt.genSalt());
}

export const resolvers: Resolvers = {
  Mutation: {
    login: async (_, { password, username }) => {
      const existing = await UserCollection.findOneByUsername(username);
      if (!existing) {
        throw new AuthenticationError('Invalid credentials');
      }
      const isPasswordCorrect = await bcrypt.compare(
        password,
        existing.password
      );
      if (!isPasswordCorrect) {
        throw new AuthenticationError('Invalid credentials');
      }
      return _createAuthData(existing);
    },
    register: async (_, { values }) => {
      _validate(
        z.object({
          username: z.string().min(3).max(20),
          password: z.string().min(5),
          email: z.string().max(100).email(),
        }),
        values
      );
      if (await UserCollection.findOneByEmail(values.email)) {
        throw new ValidationError('Email already registered');
      }
      if (await UserCollection.findOneByUsername(values.username)) {
        throw new ValidationError('Username already taken');
      }
      const user: UserModel = {
        _id: new ObjectID(),
        email: values.email,
        email_lowered: values.email.toLowerCase(),
        username: values.username,
        username_lowered: values.username.toLowerCase(),
        password: await _hashPassword(values.password),
      };
      await UserCollection.insertOne(user);
      return _createAuthData(user);
    },
    forgotPassword: async (_, { email }) => {
      _validate(
        z.object({
          email: z.string().email(),
        }),
        { email }
      );
      const existing = await UserCollection.findOneByEmail(email);
      if (!existing) {
        throw new ValidationError('User not found');
      }
      const passwordCode: ResetPasswordCodeModel = {
        _id: randomUniqString(),
        expiration: DateFns.addHours(new Date(), 2),
        userId: existing._id,
      };
      await ResetPasswordCodeCollection.insertOne(passwordCode);
      const resetUrl = `${config.appBaseUrl}/reset-password/${passwordCode._id}`;
      await sendEmail({
        subject: 'Reset your password',
        message: `Click <a href=${resetUrl}>here<a/> to reset your password 
        or copy url: <br />${resetUrl}`,
        to: email,
      });
    },
    resetPassword: async (_, { code, newPassword }) => {
      _validate(
        z.object({
          newPassword: z.string().min(5),
        }),
        { newPassword }
      );
      const passwordCode = await ResetPasswordCodeCollection.findById(code);
      if (!passwordCode) {
        throw new ValidationError('Invalid or used code');
      }
      if (passwordCode.expiration.getTime() < Date.now()) {
        throw new ValidationError('Expired code');
      }
      const user = await UserCollection.findByIdOrThrow(passwordCode.userId);
      user.password = await _hashPassword(newPassword);
      await ResetPasswordCodeCollection.deleteById(code);
      return _createAuthData(user);
    },
  },
};
