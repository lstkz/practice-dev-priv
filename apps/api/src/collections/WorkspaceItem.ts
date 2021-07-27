import { ObjectID } from 'mongodb2';
import { createCollection } from '../db';

export enum WorkspaceItemType {
  File = 'file',
  Directory = 'directory',
}

export interface WorkspaceItemModel {
  _id: string;
  workspaceId: ObjectID;
  userId: ObjectID;
  name: string;
  parentId?: string | null;
  type: WorkspaceItemType;
  hash: string;
  s3Key?: string;
  sourceS3Key?: string;
}

export const WorkspaceItemCollection = createCollection<WorkspaceItemModel>(
  'workspaceItem',
  [
    {
      key: {
        workspaceId: 1,
      },
    },
  ]
);
