export * from '@pvd/types';

import { TesterSocketMessage, TestInfo } from '@pvd/types';

export interface User {
  id: string;
  email: string;
  username: string;
  isAdmin?: boolean | null;
  avatarId?: string | null;
  isVerified: boolean;
}

export interface AuthData {
  user: User;
  token: string;
}

export type IframeMessage =
  | {
      type: 'inject';
      payload: { code: string; importMap: Record<string, string> };
    }
  | {
      type: 'error';
      payload: { error: any };
    };

export type IframeCallbackMessage = {
  target: 'preview';
  type: 'hard-reload';
};

export type IframeNavigationMessage =
  | {
      target: 'navigation';
      type: 'navigate';
      payload: { url: string };
    }
  | {
      target: 'navigation';
      type: 'refresh';
    }
  | {
      target: 'navigation';
      type: 'go';
      payload: { diff: number };
    };

export type IframeNavigationCallbackMessage =
  | {
      target: 'navigation';
      type: 'navigated';
      payload: { url: string };
    }
  | {
      target: 'navigation';
      type: 'replaced';
      payload: { url: string };
    }
  | {
      target: 'navigation';
      type: 'did-go';
      payload: { diff: number };
    };

export interface LibraryDefinition {
  name: string;
  types: string;
  source: string;
}

export enum SubmissionStatus {
  Queued = 'queued',
  Running = 'running',
  Pass = 'pass',
  Fail = 'fail',
}

export interface TestSubmissionLambdaInput {
  submissionId: string;
  apiBaseUrl: string;
  notifyKey: string;
  testFileUrl: string;
  indexUrl: string;
}

export interface TestSubmissionLambdaOutput {
  success: boolean;
  testRun: TestInfo[];
}

export interface AwsCredentials {
  accessKeyId: string;
  secretAccessKey: string;
  sessionToken: string;
}

export interface AwsUploadContentAuth {
  bucketName: string;
  credentials: AwsCredentials;
}

export interface TestUpdateSocketMsg {
  type: 'TestUpdate';
  payload: {
    userId: string;
    messages: TesterSocketMessage[];
  };
}

export type AppSocketMsg = TestUpdateSocketMsg;

export interface NotificationSettings {
  newsletter: boolean;
}

export interface Challenge {
  id: string;
  challengeId: number;
  moduleId: number;
  title: string;
  description: string;
  difficulty: string;
  practiceTime: number;
  detailsS3Key: string;
  htmlS3Key: string;
  solutionUrl: string;
  tests: Array<string>;
}

export enum SubmissionSortBy {
  Newest = 'newest',
  Oldest = 'oldest',
}

export interface Workspace {
  id: string;
  items: WorkspaceNode[];
  s3Auth: WorkspaceS3Auth;
  libraries: LibraryDefinition[];
}

export interface ReadOnlyWorkspace {
  id: string;
  items: WorkspaceNode[];
  libraries: LibraryDefinition[];
}

export interface WorkspaceNode {
  id: string;
  name: string;
  parentId?: string | null;
  hash: string;
  type: WorkspaceNodeType;
  isLocked?: boolean | null;
}

export interface ReadOnlyWorkspace {}

export interface WorkspaceS3Auth {
  bucketName: string;
  credentials: AwsCredentials;
}

export enum WorkspaceNodeType {
  File = 'file',
  Directory = 'directory',
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
}

export interface Submission {
  id: string;
  createdAt: string;
  status: SubmissionStatus;
}

export interface SubmissionNode {
  id: string;
  name: string;
  parentId: string | null;
  type: WorkspaceNodeType;
  s3Key?: string | null;
}

export interface OkResult {
  ok: boolean;
}

export interface AvatarUploadResult {
  avatarId: string;
}

export interface PresignedPostField {
  name: string;
  value: string;
}

export interface PresignedPost {
  url: string;
  fields: PresignedPostField[];
}

export interface UserProfile {
  name?: string | null;
  about?: string | null;
  country?: string | null;
  url?: string | null;
}

export interface Solution {
  id: string;
  title: string;
  author: Author;
}

export interface Author {
  id: string;
  username: string;
  avatarId?: string | null;
}
