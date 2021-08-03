import { ObjectID } from 'mongodb2';
import { SubmissionStatus } from 'shared';
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
}

export const SubmissionCollection =
  createCollection<SubmissionModel>('submission');
