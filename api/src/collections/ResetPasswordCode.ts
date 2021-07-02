import { ObjectID } from 'mongodb';
import { createCollection } from '../db';

export interface ResetPasswordCodeModel {
  _id: string;
  userId: ObjectID;
  expiration: Date;
}

export const ResetPasswordCodeCollection = createCollection<ResetPasswordCodeModel>(
  'resetPasswordCode'
);
