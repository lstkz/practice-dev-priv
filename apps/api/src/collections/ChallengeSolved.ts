import { ObjectID } from 'mongodb2';
import { createCollection } from '../db';

export interface ChallengeSolvedModel {
  _id: string;
  userId: ObjectID;
  challengeId: string;
  moduleId: number;
}

export const ChallengeSolvedCollection = createCollection<ChallengeSolvedModel>(
  'challengeSolved',
  [
    {
      key: {
        userId: 1,
      },
    },
  ]
);

export function getChallengeSolvedId(
  values: Omit<ChallengeSolvedModel, '_id' | 'moduleId'>
) {
  const { userId, challengeId } = values;
  return `${userId}_${challengeId}`;
}
