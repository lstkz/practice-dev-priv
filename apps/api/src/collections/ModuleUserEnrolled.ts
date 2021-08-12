import { ObjectID } from 'mongodb2';
import { createCollection } from '../db';

export interface ModuleUserEnrolledModel {
  _id: string;
  userId: ObjectID;
  moduleId: number;
}

export const ModuleUserEnrolledCollection =
  createCollection<ModuleUserEnrolledModel>('moduleUserEnrolled');

export function getModuleUserEnrolledId(
  values: Omit<ModuleUserEnrolledModel, '_id'>
) {
  const { userId, moduleId } = values;
  return `${userId}_${moduleId}`;
}
