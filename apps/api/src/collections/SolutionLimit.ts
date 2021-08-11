import { createCollection } from '../db';

export interface SolutionLimitModel {
  _id: string;
  count: number;
}

export const SolutionLimitCollection =
  createCollection<SolutionLimitModel>('solutionLimit');
