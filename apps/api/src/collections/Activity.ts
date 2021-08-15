import { ObjectID } from 'mongodb2';
import { createCollection } from '../db';

export interface DbActivityChallengeSolved {
  type: 'challenge-solved';
  values: {
    moduleId: number;
    challengeId: string;
  };
}
export interface DbActivityRegistered {
  type: 'registered';
}

export type DbActivity = DbActivityChallengeSolved | DbActivityRegistered;

export interface ActivityModel {
  _id: ObjectID;
  userId: ObjectID;
  createdAt: Date;
  data: DbActivity;
}

export const ActivityCollection = createCollection<ActivityModel>('activity');
