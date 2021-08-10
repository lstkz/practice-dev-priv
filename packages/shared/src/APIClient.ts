import fetch from 'cross-fetch';

// IMPORTS
import {
  AwsUploadContentAuth,
  Challenge,
  Workspace,
  ReadOnlyWorkspace,
  PaginatedResult,
  Submission,
  OkResult,
  AvatarUploadResult,
  AuthData,
  PresignedPost,
  User,
  UserProfile,
  NotificationSettings,
  WorkspaceS3Auth,
} from './types';
// IMPORTS END

import { SubmissionSortBy, WorkspaceNodeType } from './types';
type ObjectId = string;

export class APIClient {
  constructor(
    private baseUrl: string,
    public getToken: () => string | null,
    private agent?: any
  ) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  // SIGNATURES
  aws_getAwsUploadContentAuth(): Promise<AwsUploadContentAuth> {
    return this.call('aws.getAwsUploadContentAuth', {});
  }
  challenge_getChallenge(id: string): Promise<Challenge> {
    return this.call('challenge.getChallenge', { id });
  }
  challenge_updateChallenge(values: {
    challengeId: number;
    moduleId: number;
    title: string;
    description: string;
    difficulty: string;
    practiceTime: number;
    detailsS3Key: string;
    htmlS3Key: string;
    solutionUrl: string;
    tests: string[];
    testS3Key: string;
    files: {
      name: string;
      directory: string;
      s3Key: string;
      isLocked?: boolean | null | undefined;
    }[];
    libraries: { name: string; types: string; source: string }[];
  }): Promise<void> {
    return this.call('challenge.updateChallenge', { values });
  }
  module_updateModule(values: {
    id: number;
    title: string;
    description: string;
    difficulty: string;
    mainTechnology: string;
    tags: string[];
  }): Promise<void> {
    return this.call('module.updateModule', { values });
  }
  submission_forkSubmission(
    workspaceId: ObjectId,
    submissionId: ObjectId
  ): Promise<Workspace> {
    return this.call('submission.forkSubmission', {
      workspaceId,
      submissionId,
    });
  }
  submission_getSubmissionReadonlyWorkspace(
    id: ObjectId
  ): Promise<ReadOnlyWorkspace> {
    return this.call('submission.getSubmissionReadonlyWorkspace', { id });
  }
  submission_notifyTestProgress(notifyKey: string, data: any[]): Promise<void> {
    return this.call('submission.notifyTestProgress', { notifyKey, data });
  }
  submission_searchSubmissions(criteria: {
    limit: number;
    offset: number;
    sortBy: SubmissionSortBy;
  }): Promise<PaginatedResult<Submission>> {
    return this.call('submission.searchSubmissions', { criteria });
  }
  submission_submit(values: {
    workspaceId: ObjectId;
    indexHtmlS3Key: string;
  }): Promise<string> {
    return this.call('submission.submit', { values });
  }
  user_changeEmail(newEmail: string): Promise<OkResult> {
    return this.call('user.changeEmail', { newEmail });
  }
  user_changePassword(password: string): Promise<void> {
    return this.call('user.changePassword', { password });
  }
  user_changeUsername(username: string): Promise<void> {
    return this.call('user.changeUsername', { username });
  }
  user_completeAvatarUpload(): Promise<AvatarUploadResult> {
    return this.call('user.completeAvatarUpload', {});
  }
  user_confirmChangeEmail(code: string): Promise<void> {
    return this.call('user.confirmChangeEmail', { code });
  }
  user_confirmEmail(code: string): Promise<AuthData> {
    return this.call('user.confirmEmail', { code });
  }
  user_confirmResetPassword(
    code: string,
    newPassword: string
  ): Promise<AuthData> {
    return this.call('user.confirmResetPassword', { code, newPassword });
  }
  user_deleteAvatar(): Promise<void> {
    return this.call('user.deleteAvatar', {});
  }
  user_getAvatarUploadUrl(): Promise<PresignedPost> {
    return this.call('user.getAvatarUploadUrl', {});
  }
  user_getMe(): Promise<User> {
    return this.call('user.getMe', {});
  }
  user_getMyProfile(): Promise<UserProfile> {
    return this.call('user.getMyProfile', {});
  }
  user_updateNotificationSettings(values: {
    newsletter: boolean;
  }): Promise<NotificationSettings> {
    return this.call('user.updateNotificationSettings', { values });
  }
  user_getNotificationSettings(): Promise<NotificationSettings> {
    return this.call('user.getNotificationSettings', {});
  }
  user_login(values: {
    password: string;
    usernameOrEmail: string;
  }): Promise<AuthData> {
    return this.call('user.login', { values });
  }
  user_loginGithub(code: string): Promise<AuthData> {
    return this.call('user.loginGithub', { code });
  }
  user_loginGoogle(accessToken: string): Promise<AuthData> {
    return this.call('user.loginGoogle', { accessToken });
  }
  user_logout(): Promise<void> {
    return this.call('user.logout', {});
  }
  user_register(values: {
    password: string;
    username: string;
    email: string;
  }): Promise<AuthData> {
    return this.call('user.register', { values });
  }
  user_registerGithub(code: string): Promise<AuthData> {
    return this.call('user.registerGithub', { code });
  }
  user_registerGoogle(accessToken: string): Promise<AuthData> {
    return this.call('user.registerGoogle', { accessToken });
  }
  user_resendVerificationCode(): Promise<void> {
    return this.call('user.resendVerificationCode', {});
  }
  user_resetPassword(usernameOrEmail: string): Promise<void> {
    return this.call('user.resetPassword', { usernameOrEmail });
  }
  user_updateMyProfile(values: {
    name?: string | null | undefined;
    about?: string | null | undefined;
    country?: string | null | undefined;
    url?: string | null | undefined;
  }): Promise<UserProfile> {
    return this.call('user.updateMyProfile', { values });
  }
  workspace_createWorkspaceNode(values: {
    id: string;
    name: string;
    workspaceId: ObjectId;
    hash: string;
    type: WorkspaceNodeType;
    parentId?: string | null | undefined;
  }): Promise<void> {
    return this.call('workspace.createWorkspaceNode', { values });
  }
  workspace_deleteWorkspaceNode(id: string): Promise<void> {
    return this.call('workspace.deleteWorkspaceNode', { id });
  }
  workspace_getOrCreateWorkspace(values: {
    challengeUniqId: string;
  }): Promise<Workspace> {
    return this.call('workspace.getOrCreateWorkspace', { values });
  }
  workspace_getWorkspaceS3Auth(
    workspaceId: ObjectId
  ): Promise<WorkspaceS3Auth> {
    return this.call('workspace.getWorkspaceS3Auth', { workspaceId });
  }
  workspace_updateWorkspaceNode(values: {
    id: string;
    name?: string | null | undefined;
    parentId?: string | null | undefined;
    hash?: string | null | undefined;
  }): Promise<void> {
    return this.call('workspace.updateWorkspaceNode', { values });
  }
  // SIGNATURES END
  private async call(name: string, params: any): Promise<any> {
    const token = this.getToken();
    const headers: any = {
      'content-type': 'application/json',
    };
    if (token) {
      headers['authorization'] = token;
    }

    const res = await fetch(`${this.baseUrl}/rpc/${name}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(params),
      // @ts-ignore
      agent: this.agent,
    });
    const body = await res.json();
    if (res.status !== 200) {
      const err: any = new Error(body.error || 'Failed to call API');
      err.res = res;
      err.body = body;
      throw err;
    }
    return body;
  }
}
