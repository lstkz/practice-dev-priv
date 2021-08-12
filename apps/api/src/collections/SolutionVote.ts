import { ObjectID } from 'mongodb2';
import { createCollection } from '../db';

export interface SolutionVoteModel {
  _id: string;
  userId: ObjectID;
  solutionId: ObjectID;
  score: number;
}

export const SolutionVoteCollection = createCollection<SolutionVoteModel>(
  'solutionVote',
  [
    {
      key: {
        userId: 1,
      },
    },
    {
      key: {
        solutionId: 1,
      },
    },
  ]
);

export function createSolutionVoteId({
  userId,
  solutionId,
}: Pick<SolutionVoteModel, 'userId' | 'solutionId'>) {
  return `${userId}_${solutionId}`;
}
