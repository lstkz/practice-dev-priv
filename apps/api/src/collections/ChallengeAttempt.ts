import { ObjectID } from 'mongodb2';
import { createCollection } from '../db';

export interface ChallengeAttemptModel {
  _id: string;
  userId: ObjectID;
  challengeId: string;
}

export const ChallengeAttemptCollection =
  createCollection<ChallengeAttemptModel>('challengeAttempt');

export function getChallengeAttemptId(
  values: Omit<ChallengeAttemptModel, '_id'>
) {
  const { userId, challengeId } = values;
  return `${userId}_${challengeId}`;
}
