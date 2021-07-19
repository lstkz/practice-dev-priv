import { createCollection } from '../db';
import { ObjectID } from 'mongodb2';

export interface ConfirmEmailChangeModel {
  _id: string;
  userId: ObjectID;
  newEmail: string;
  expireAt: Date;
  isUsed?: boolean;
}

export const ConfirmEmailChangeCollection =
  createCollection<ConfirmEmailChangeModel>('confirmEmailChange');
