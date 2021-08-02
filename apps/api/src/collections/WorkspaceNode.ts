import { ObjectID } from 'mongodb2';
import { createCollection } from '../db';

export enum WorkspaceNodeType {
  File = 'file',
  Directory = 'directory',
}

export interface WorkspaceNodeModel {
  _id: string;
  workspaceId: ObjectID;
  userId: ObjectID;
  name: string;
  parentId: string | null;
  type: WorkspaceNodeType;
  hash: string;
  s3Key?: string | null;
  sourceS3Key?: string | null;
  uniqueKey: string;
  isLocked?: boolean | null;
}

export const WorkspaceNodeCollection = createCollection<WorkspaceNodeModel>(
  'workspaceItem',
  [
    {
      key: {
        workspaceId: 1,
      },
    },
    {
      key: {
        uniqueKey: 1,
      },
      unique: true,
    },
  ]
);
