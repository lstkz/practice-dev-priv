import { ObjectID } from 'mongodb2';
import { SubmissionStatus, TestInfo } from 'shared';
import { createCollection } from '../db';
import { WorkspaceNodeType } from './WorkspaceNode';

export interface SubmissionNodeModel {
  _id: string;
  name: string;
  parentId: string | null;
  type: WorkspaceNodeType;
  s3Key?: string | null;
  sourceS3Key?: string | null;
}

export interface SubmissionModel {
  _id: ObjectID;
  userId: ObjectID;
  workspaceId: ObjectID;
  challengeUniqId: string;
  indexHtmlS3Key: string;
  nodes: SubmissionNodeModel[];
  createdAt: Date;
  status: SubmissionStatus;
  testRun?: TestInfo[] | null | undefined;
  notifyKey: string;
}

export const SubmissionCollection = createCollection<SubmissionModel>(
  'submission',
  [
    {
      key: {
        notifyKey: 1,
      },
      unique: true,
    },
  ]
);
