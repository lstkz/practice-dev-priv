import fetch from 'cross-fetch';

// IMPORTS
import {
  PaginatedResult,
  Activity,
  AwsUploadContentAuth,
  ChallengeDetails,
  NextChallengeInfo,
  Challenge,
  Follower,
  Module,
  Solution,
  Workspace,
  ReadOnlyWorkspace,
  VoteResult,
  Submission,
  OkResult,
  AvatarUploadResult,
  AuthData,
  PresignedPost,
  User,
  UserProfile,
  NotificationSettings,
  UserPublicProfile,
  WorkspaceS3Auth,
} from './types';
// IMPORTS END

import {
  SubmissionSortBy,
  WorkspaceNodeType,
  SolutionSortBy,
  LegacyUserEntity,
} from './types';
type ObjectId = string;

export class APIClient {
  constructor(
    private baseUrl: string,
    public getToken: () => string | null,
    private agent?: any
  ) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  hasToken() {
    return this.getToken() != null;
  }

  // SIGNATURES
  activity_searchActivities(criteria: {
    username: string;
    limit: number;
    offset: number;
  }): Promise<PaginatedResult<Activity>> {
    return this.call('activity.searchActivities', { criteria });
  }
  aws_getAwsUploadContentAuth(): Promise<AwsUploadContentAuth> {
    return this.call('aws.getAwsUploadContentAuth', {});
  }
  challenge_getChallenge(values: {
    id?: string | undefined;
    slug?: string | undefined;
  }): Promise<ChallengeDetails> {
    return this.call('challenge.getChallenge', { values });
  }
  challenge_getNextChallenge(values: {
    id?: string | undefined;
    slug?: string | undefined;
  }): Promise<NextChallengeInfo> {
    return this.call('challenge.getNextChallenge', { values });
  }
  challenge_searchChallenges(criteria: {
    limit: number;
    offset: number;
    moduleId: number;
  }): Promise<PaginatedResult<Challenge>> {
    return this.call('challenge.searchChallenges', { criteria });
  }
  challenge_updateChallenge(values: {
    slug: string;
    challengeModuleId: number;
    title: string;
    moduleId: number;
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
  follower_followUser(username: string): Promise<void> {
    return this.call('follower.followUser', { username });
  }
  follower_searchFollowers(criteria: {
    username: string;
    limit: number;
    offset: number;
  }): Promise<PaginatedResult<Follower>> {
    return this.call('follower.searchFollowers', { criteria });
  }
  follower_unfollowUser(username: string): Promise<void> {
    return this.call('follower.unfollowUser', { username });
  }
  migrate_importLegacyUsers(users: LegacyUserEntity[]): Promise<void> {
    return this.call('migrate.importLegacyUsers', { users });
  }
  module_getModule(values: {
    id?: number | undefined;
    slug?: string | undefined;
  }): Promise<Module> {
    return this.call('module.getModule', { values });
  }
  module_searchModules(criteria: {
    limit: number;
    offset: number;
  }): Promise<PaginatedResult<Module>> {
    return this.call('module.searchModules', { criteria });
  }
  module_updateModule(values: {
    id: number;
    slug: string;
    title: string;
    description: string;
    difficulty: string;
    tags: string[];
    mainTechnology: string;
    isComingSoon?: boolean | undefined;
  }): Promise<void> {
    return this.call('module.updateModule', { values });
  }
  solution_createSolution(values: {
    title: string;
    submissionId: ObjectId;
  }): Promise<Solution> {
    return this.call('solution.createSolution', { values });
  }
  solution_deleteSolution(solutionId: ObjectId): Promise<void> {
    return this.call('solution.deleteSolution', { solutionId });
  }
  submission_forkAnySubmission(
    workspaceId: ObjectId,
    submissionId: ObjectId
  ): Promise<Workspace> {
    return this.call('submission.forkAnySubmission', {
      workspaceId,
      submissionId,
    });
  }
  solution_forkSolution(
    workspaceId: ObjectId,
    solutionId: ObjectId
  ): Promise<Workspace> {
    return this.call('solution.forkSolution', { workspaceId, solutionId });
  }
  solution_getSolution(id: ObjectId): Promise<Solution> {
    return this.call('solution.getSolution', { id });
  }
  solution_getSolutionReadonlyWorkspace(
    id: ObjectId
  ): Promise<ReadOnlyWorkspace> {
    return this.call('solution.getSolutionReadonlyWorkspace', { id });
  }
  solution_searchSolutions(criteria: {
    limit: number;
    offset: number;
    sortBy: SolutionSortBy;
    username?: string | undefined;
    challengeId?: string | undefined;
  }): Promise<PaginatedResult<Solution>> {
    return this.call('solution.searchSolutions', { criteria });
  }
  solution_updateSolution(
    solutionId: ObjectId,
    values: { title: string }
  ): Promise<Solution> {
    return this.call('solution.updateSolution', { solutionId, values });
  }
  solution_voteSolution(
    solutionId: ObjectId,
    vote: 'up' | 'down'
  ): Promise<VoteResult> {
    return this.call('solution.voteSolution', { solutionId, vote });
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
    username?: string | undefined;
    challengeId?: string | undefined;
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
  user_getPublicProfile(username: string): Promise<UserPublicProfile> {
    return this.call('user.getPublicProfile', { username });
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
    username: string;
    email: string;
    password: string;
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
    url?: string | null | undefined;
    about?: string | null | undefined;
    country?: string | null | undefined;
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
    challengeId: string;
  }): Promise<Workspace> {
    return this.call('workspace.getOrCreateWorkspace', { values });
  }
  workspace_getWorkspaceS3Auth(
    workspaceId: ObjectId
  ): Promise<WorkspaceS3Auth> {
    return this.call('workspace.getWorkspaceS3Auth', { workspaceId });
  }
  workspace_resetWorkspace(workspaceId: ObjectId): Promise<Workspace> {
    return this.call('workspace.resetWorkspace', { workspaceId });
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
