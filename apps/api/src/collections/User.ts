import { ObjectID } from 'mongodb';
import { safeExtend } from '../common/helper';
import { createCollection } from '../db';

export interface UserProfile {
  name?: string | null;
  about?: string | null;
  country?: string | null;
  url?: string | null;
}

export interface NotificationSettings {
  newsletter: boolean;
}

export interface UserModel {
  _id: ObjectID;
  email: string;
  email_lowered: string;
  username: string;
  username_lowered: string;
  salt: string;
  isVerified: boolean;
  isAdmin?: boolean;
  password: string;
  avatarId?: string | null;
  githubId?: number;
  profile?: UserProfile;
  notificationSettings?: NotificationSettings;
}

export const UserCollection = safeExtend(
  createCollection<UserModel>('user', [
    {
      key: {
        email_lowered: 1,
      },
      unique: true,
    },
    {
      key: {
        username_lowered: 1,
      },
      unique: true,
    },
    {
      key: {
        githubId: 1,
      },
      unique: true,
      sparse: true,
    },
  ]),
  {
    findOneByEmail(email: string) {
      return UserCollection.findOne({ email_lowered: email.toLowerCase() });
    },
    findOneByUsername(username: string) {
      return UserCollection.findOne({
        username_lowered: username.toLowerCase(),
      });
    },
    findOneByUsernameOrEmail(usernameOrEmail: string) {
      return usernameOrEmail.includes('@')
        ? this.findOneByEmail(usernameOrEmail)
        : this.findOneByUsername(usernameOrEmail);
    },
  }
);
