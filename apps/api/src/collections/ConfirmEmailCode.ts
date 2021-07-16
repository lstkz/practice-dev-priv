import { ObjectID } from 'mongodb';
import { createCollection } from '../db';

export interface ConfirmEmailCodeModel {
  _id: string;
  userId: ObjectID;
  usedAt?: Date;
}

export const ConfirmEmailCodeCollection = createCollection<ConfirmEmailCodeModel>(
  'confirmEmailCode',
  [
    {
      key: {
        userId: 1,
      },
    },
  ]
);
