import { ObjectID } from 'mongodb2';
import { createCollection } from '../db';

export interface SolutionModel {
  _id: ObjectID;
  userId: ObjectID;
  submissionId: ObjectID;
  challengeId: string;
  title: string;
  createdAt: Date;
  score: number;
}

export const SolutionCollection = createCollection<SolutionModel>('solution');
