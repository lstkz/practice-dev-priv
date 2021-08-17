export * from '@pvd/types';

import { TesterSocketMessage, TestInfo } from '@pvd/types';

export interface BundleData {
  code: string;
  css: string;
}

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
      payload: { data: BundleData; importMap: Record<string, string> };
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

export interface ChallengeDetails {
  id: string;
  challengeModuleId: number;
  title: string;
  slug: string;
  moduleId: number;
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

export enum SolutionSortBy {
  Best = 'best',
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
  challenge: {
    id: string;
    title: string;
    slug: string;
  };
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
  createdAt: string;
  score: number;
  myScore: number;
  challenge: {
    id: string;
    title: string;
    slug: string;
  };
}

export interface Author {
  id: string;
  username: string;
  avatarId?: string | null;
}

export interface VoteResult {
  score: number;
  myScore: number;
}

export interface ChallengeStats {
  uniqueAttempts: number;
  passingSubmissions: number;
  totalSubmissions: number;
  solutions: number;
}

export interface ModuleStats {
  enrolledUsers: number;
}

export interface Module {
  id: number;
  title: string;
  slug: string;
  description: string;
  tags: string[];
  difficulty: string;
  mainTechnology: string;
  stats: ModuleStats;
  totalTime: number;
  solvedChallenges: number;
  totalChallenges: number;
  isAttempted: boolean;
}

export interface Challenge {
  id: string;
  moduleId: number;
  challengeModuleId: number;
  title: string;
  slug: string;
  description: string;
  difficulty: string;
  practiceTime: number;
  isSolved: boolean;
  isAttempted: boolean;
  stats: ChallengeStats;
}

export interface UserPublicProfile {
  id: string;
  username: string;
  name: string;
  avatarId?: string | null;
  rank: number;
  crypto: number;
  solutions: number;
  submissions: number;
  followers: number;
  following: number;
  memberSince: string;
  lastSeen: string;
  about: string;
  isFollowing: boolean;
}

export interface ActivityChallengeSolved {
  type: 'challenge-solved';
  values: {
    createdAt: string;
    module: {
      id: number;
      title: string;
      slug: string;
    };
    challenge: {
      id: string;
      moduleId: number;
      challengeModuleId: number;
      title: string;
      slug: string;
    };
  };
}
export interface ActivityRegistered {
  type: 'registered';
  values: {
    createdAt: string;
  };
}

export type Activity = ActivityChallengeSolved | ActivityRegistered;

export type ExtractType<T> = T extends { type: infer S } ? S : never;

export interface Follower {
  id: string;
  username: string;
  name: string;
  avatarId?: string | null;
  isFollowing: boolean;
}
