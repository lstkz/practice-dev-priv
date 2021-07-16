import { ObjectID } from 'mongodb';
import { createCollection } from '../db';

export interface ResetPasswordCodeModel {
  _id: string;
  userId: ObjectID;
  expireAt: Date;
}

export const ResetPasswordCodeCollection =
  createCollection<ResetPasswordCodeModel>('resetPasswordCode');
