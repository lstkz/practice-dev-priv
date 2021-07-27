import { ObjectID } from 'mongodb2';
import { createCollection } from '../db';

export interface WorkspaceModel {
  _id: ObjectID;
  userId: ObjectID;
  challengeUniqId: string;
  dedupKey?: string;
  isReady: boolean;
}

export const WorkspaceCollection = createCollection<WorkspaceModel>(
  'workspace',
  [
    {
      key: {
        userId: 1,
        challengeUniqId: 1,
      },
    },
    {
      key: {
        dedupKey: 1,
      },
      unique: true,
      sparse: true,
    },
  ]
);
