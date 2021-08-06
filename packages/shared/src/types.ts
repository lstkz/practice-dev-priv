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

export interface Step {
  text: string;
  data?: any;
}

export type TestResult =
  | 'pass'
  | 'fail'
  | 'pending'
  | 'running'
  | 'fail-skipped';

export interface TestInfo {
  id: number;
  name: string;
  error?: string;
  steps: Step[];
  result: TestResult;
}

export type SocketMessage =
  | {
      type: 'TEST_INFO';
      meta: {
        id: string;
      };
      payload: {
        tests: TestInfo[];
      };
    }
  | {
      type: 'STARTING_TEST';
      meta: {
        id: string;
      };
      payload: {
        testId: number;
      };
    }
  | {
      type: 'TEST_FAIL';
      meta: {
        id: string;
      };
      payload: {
        testId: number;
        error: string;
      };
    }
  | {
      type: 'TEST_PASS';
      meta: {
        id: string;
      };
      payload: {
        testId: number;
      };
    }
  | {
      type: 'STEP';
      meta: {
        id: string;
      };
      payload: {
        testId: number;
        text: string;
        data: any;
      };
    }
  | {
      type: 'RESULT';
      meta: {
        id: string;
      };
      payload: {
        success: boolean;
      };
    };

export interface AwsCredentials {
  accessKeyId: string;
  secretAccessKey: string;
  sessionToken: string;
}

export interface AwsUploadContentAuth {
  bucketName: string;
  credentials: AwsCredentials;
}

export interface TaskSolvedSocketMsg {
  type: 'TaskSolved';
  payload: {
    userId: string;
    moduleId: string;
    taskId: number;
    score: number;
  };
}

export type AppSocketMsg = SocketMessage;

export interface NotificationSettings {
  newsletter: boolean;
}

export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  TestProgressData: any;
  Void: any;
};

export interface Challenge {
  id: Scalars['String'];
  challengeId: Scalars['Int'];
  moduleId: Scalars['Int'];
  title: Scalars['String'];
  description: Scalars['String'];
  difficulty: Scalars['String'];
  practiceTime: Scalars['Float'];
  detailsS3Key: Scalars['String'];
  htmlS3Key: Scalars['String'];
  solutionUrl: Scalars['String'];
  tests: Array<Scalars['String']>;
}

export enum SubmissionSortBy {
  Newest = 'newest',
  Oldest = 'oldest',
}
