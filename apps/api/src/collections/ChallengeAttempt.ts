import { ObjectID } from 'mongodb2';
import { createCollection } from '../db';

export interface ChallengeAttemptModel {
  _id: string;
  userId: ObjectID;
  moduleId: number;
  challengeId: string;
}

export const ChallengeAttemptCollection =
  createCollection<ChallengeAttemptModel>('challengeAttempt', [
    {
      key: {
        userId: 1,
      },
    },
  ]);

export function getChallengeAttemptId(
  values: Omit<ChallengeAttemptModel, '_id' | 'moduleId'>
) {
  const { userId, challengeId } = values;
  return `${userId}_${challengeId}`;
}
