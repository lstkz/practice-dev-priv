import { ObjectID } from 'mongodb2';
import { createCollection } from '../db';

export interface FollowerModel {
  _id: string;
  targetUserId: ObjectID;
  fromUserId: ObjectID;
  createdAt: Date;
}

export const FollowerCollection = createCollection<FollowerModel>('follower', [
  {
    key: {
      targetUserId: 1,
    },
  },
  {
    key: {
      fromUserId: 1,
    },
  },
]);

export function createFollowerId({
  targetUserId,
  fromUserId,
}: Pick<FollowerModel, 'targetUserId' | 'fromUserId'>) {
  return `${targetUserId}_${fromUserId}`;
}
