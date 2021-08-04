import {
  GraphQLResolveInfo,
  GraphQLScalarType,
  GraphQLScalarTypeConfig,
} from 'graphql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = {
  [X in Exclude<keyof T, K>]?: T[X];
} &
  { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  TestProgressData: any;
  Void: any;
};

export type AuthResult = {
  __typename?: 'AuthResult';
  token: Scalars['String'];
  user: User;
};

export type AvatarUploadResult = {
  __typename?: 'AvatarUploadResult';
  avatarId: Scalars['String'];
};

export type AwsCredentials = {
  __typename?: 'AwsCredentials';
  accessKeyId: Scalars['String'];
  secretAccessKey: Scalars['String'];
  sessionToken: Scalars['String'];
};

export type AwsUploadContentAuth = {
  __typename?: 'AwsUploadContentAuth';
  bucketName: Scalars['String'];
  credentials: AwsCredentials;
};

export type Challenge = {
  __typename?: 'Challenge';
  challengeId: Scalars['Int'];
  moduleId: Scalars['Int'];
  title: Scalars['String'];
  description: Scalars['String'];
  difficulty: Scalars['String'];
  practiceTime: Scalars['Float'];
  detailsS3Key: Scalars['String'];
  htmlS3Key: Scalars['String'];
  solutionUrl: Scalars['String'];
};

export type ChallengeFileInput = {
  name: Scalars['String'];
  directory: Scalars['String'];
  s3Key: Scalars['String'];
  isLocked?: Maybe<Scalars['Boolean']>;
};

export type CreateWorkspaceInput = {
  challengeUniqId: Scalars['String'];
};

export type CreateWorkspaceNodeInput = {
  id: Scalars['String'];
  workspaceId: Scalars['String'];
  name: Scalars['String'];
  parentId?: Maybe<Scalars['String']>;
  hash: Scalars['String'];
  type: WorkspaceNodeType;
};

export type LibraryDefinition = {
  __typename?: 'LibraryDefinition';
  name: Scalars['String'];
  types: Scalars['String'];
  source: Scalars['String'];
};

export type LibraryInput = {
  name: Scalars['String'];
  types: Scalars['String'];
  source: Scalars['String'];
};

export type LoginInput = {
  usernameOrEmail: Scalars['String'];
  password: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  login: AuthResult;
  register: AuthResult;
  loginGithub: AuthResult;
  loginGoogle: AuthResult;
  registerGithub: AuthResult;
  registerGoogle: AuthResult;
  confirmEmail: AuthResult;
  logout?: Maybe<Scalars['Void']>;
  resetPassword?: Maybe<Scalars['Void']>;
  confirmResetPassword: AuthResult;
  updateMyProfile: MyProfile;
  completeAvatarUpload: AvatarUploadResult;
  deleteAvatar?: Maybe<Scalars['Void']>;
  changeUsername?: Maybe<Scalars['Void']>;
  changeEmail: OkResult;
  confirmChangeEmail?: Maybe<Scalars['Void']>;
  changePassword?: Maybe<Scalars['Void']>;
  updateNotificationSettings?: Maybe<NotificationSettings>;
  resendVerificationCode?: Maybe<Scalars['Void']>;
  updateModule?: Maybe<Scalars['Void']>;
  updateChallenge?: Maybe<Scalars['Void']>;
  getOrCreateWorkspace: Workspace;
  createWorkspaceNode?: Maybe<Scalars['Void']>;
  updateWorkspaceNode?: Maybe<Scalars['Void']>;
  deleteWorkspaceNode?: Maybe<Scalars['Void']>;
  submit?: Maybe<Scalars['Void']>;
  notifyTestProgress?: Maybe<Scalars['Void']>;
};

export type MutationLoginArgs = {
  values: LoginInput;
};

export type MutationRegisterArgs = {
  values: RegisterInput;
};

export type MutationLoginGithubArgs = {
  code: Scalars['String'];
};

export type MutationLoginGoogleArgs = {
  accessToken: Scalars['String'];
};

export type MutationRegisterGithubArgs = {
  code: Scalars['String'];
};

export type MutationRegisterGoogleArgs = {
  accessToken: Scalars['String'];
};

export type MutationConfirmEmailArgs = {
  code: Scalars['String'];
};

export type MutationResetPasswordArgs = {
  usernameOrEmail: Scalars['String'];
};

export type MutationConfirmResetPasswordArgs = {
  code: Scalars['String'];
  newPassword: Scalars['String'];
};

export type MutationUpdateMyProfileArgs = {
  values: UpdateProfileInput;
};

export type MutationChangeUsernameArgs = {
  username: Scalars['String'];
};

export type MutationChangeEmailArgs = {
  email: Scalars['String'];
};

export type MutationConfirmChangeEmailArgs = {
  code: Scalars['String'];
};

export type MutationChangePasswordArgs = {
  password: Scalars['String'];
};

export type MutationUpdateNotificationSettingsArgs = {
  values: NotificationSettingsInput;
};

export type MutationUpdateModuleArgs = {
  values: UpdateModuleInput;
};

export type MutationUpdateChallengeArgs = {
  values: UpdateChallengeInput;
};

export type MutationGetOrCreateWorkspaceArgs = {
  values: CreateWorkspaceInput;
};

export type MutationCreateWorkspaceNodeArgs = {
  values: CreateWorkspaceNodeInput;
};

export type MutationUpdateWorkspaceNodeArgs = {
  values: UpdateWorkspaceNodeInput;
};

export type MutationDeleteWorkspaceNodeArgs = {
  id: Scalars['String'];
};

export type MutationSubmitArgs = {
  values: SubmitInput;
};

export type MutationNotifyTestProgressArgs = {
  notifyKey: Scalars['String'];
  data: Array<Scalars['TestProgressData']>;
};

export type MyProfile = {
  __typename?: 'MyProfile';
  name?: Maybe<Scalars['String']>;
  about?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
};

export type NotificationSettings = {
  __typename?: 'NotificationSettings';
  newsletter: Scalars['Boolean'];
};

export type NotificationSettingsInput = {
  newsletter: Scalars['Boolean'];
};

export type OkResult = {
  __typename?: 'OkResult';
  ok: Scalars['Boolean'];
};

export type PresignedPost = {
  __typename?: 'PresignedPost';
  url: Scalars['String'];
  fields: Array<PresignedPostField>;
};

export type PresignedPostField = {
  __typename?: 'PresignedPostField';
  name: Scalars['String'];
  value: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  me: User;
  ping: Scalars['Float'];
  getMyProfile: MyProfile;
  getAvatarUploadUrl: PresignedPost;
  getNotificationSettings: NotificationSettings;
  getAwsUploadContentAuth: AwsUploadContentAuth;
  getWorkspaceS3Auth: WorkspaceS3Auth;
  getChallenge: Challenge;
};

export type QueryGetWorkspaceS3AuthArgs = {
  workspaceId: Scalars['String'];
};

export type QueryGetChallengeArgs = {
  id: Scalars['String'];
};

export type RegisterInput = {
  username: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
};

export type SubmitInput = {
  workspaceId: Scalars['String'];
  indexHtmlS3Key: Scalars['String'];
};

export type Subscription = {
  __typename?: 'Subscription';
  testProgress: Scalars['TestProgressData'];
};

export type SubscriptionTestProgressArgs = {
  id: Scalars['String'];
};

export type UpdateChallengeInput = {
  challengeId: Scalars['Int'];
  moduleId: Scalars['Int'];
  title: Scalars['String'];
  description: Scalars['String'];
  difficulty: Scalars['String'];
  practiceTime: Scalars['Int'];
  detailsS3Key: Scalars['String'];
  htmlS3Key: Scalars['String'];
  testS3Key: Scalars['String'];
  solutionUrl: Scalars['String'];
  files: Array<ChallengeFileInput>;
  libraries: Array<LibraryInput>;
};

export type UpdateModuleInput = {
  id: Scalars['Int'];
  title: Scalars['String'];
  description: Scalars['String'];
  mainTechnology: Scalars['String'];
  difficulty: Scalars['String'];
  tags: Array<Scalars['String']>;
};

export type UpdateProfileInput = {
  name?: Maybe<Scalars['String']>;
  about?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
};

export type UpdateWorkspaceNodeInput = {
  id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  parentId?: Maybe<Scalars['String']>;
  hash?: Maybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  id: Scalars['String'];
  username: Scalars['String'];
  email: Scalars['String'];
  avatarId?: Maybe<Scalars['String']>;
  isAdmin?: Maybe<Scalars['Boolean']>;
  isVerified: Scalars['Boolean'];
};

export type Workspace = {
  __typename?: 'Workspace';
  id: Scalars['String'];
  isReady: Scalars['Boolean'];
  items: Array<WorkspaceNode>;
  s3Auth: WorkspaceS3Auth;
  libraries: Array<LibraryDefinition>;
};

export type WorkspaceNode = {
  __typename?: 'WorkspaceNode';
  id: Scalars['String'];
  name: Scalars['String'];
  parentId?: Maybe<Scalars['String']>;
  hash: Scalars['String'];
  type: WorkspaceNodeType;
  isLocked?: Maybe<Scalars['Boolean']>;
};

export enum WorkspaceNodeType {
  File = 'file',
  Directory = 'directory',
}

export type WorkspaceS3Auth = {
  __typename?: 'WorkspaceS3Auth';
  bucketName: Scalars['String'];
  credentials: AwsCredentials;
};

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> =
  | LegacyStitchingResolver<TResult, TParent, TContext, TArgs>
  | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> {
  subscribe: SubscriptionSubscribeFn<
    { [key in TKey]: TResult },
    TParent,
    TContext,
    TArgs
  >;
  resolve?: SubscriptionResolveFn<
    TResult,
    { [key in TKey]: TResult },
    TContext,
    TArgs
  >;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {}
> =
  | ((
      ...args: any[]
    ) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo
) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {}
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  AuthResult: ResolverTypeWrapper<AuthResult>;
  String: ResolverTypeWrapper<Scalars['String']>;
  AvatarUploadResult: ResolverTypeWrapper<AvatarUploadResult>;
  AwsCredentials: ResolverTypeWrapper<AwsCredentials>;
  AwsUploadContentAuth: ResolverTypeWrapper<AwsUploadContentAuth>;
  Challenge: ResolverTypeWrapper<Challenge>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  ChallengeFileInput: ChallengeFileInput;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  CreateWorkspaceInput: CreateWorkspaceInput;
  CreateWorkspaceNodeInput: CreateWorkspaceNodeInput;
  LibraryDefinition: ResolverTypeWrapper<LibraryDefinition>;
  LibraryInput: LibraryInput;
  LoginInput: LoginInput;
  Mutation: ResolverTypeWrapper<{}>;
  MyProfile: ResolverTypeWrapper<MyProfile>;
  NotificationSettings: ResolverTypeWrapper<NotificationSettings>;
  NotificationSettingsInput: NotificationSettingsInput;
  OkResult: ResolverTypeWrapper<OkResult>;
  PresignedPost: ResolverTypeWrapper<PresignedPost>;
  PresignedPostField: ResolverTypeWrapper<PresignedPostField>;
  Query: ResolverTypeWrapper<{}>;
  RegisterInput: RegisterInput;
  SubmitInput: SubmitInput;
  Subscription: ResolverTypeWrapper<{}>;
  TestProgressData: ResolverTypeWrapper<Scalars['TestProgressData']>;
  UpdateChallengeInput: UpdateChallengeInput;
  UpdateModuleInput: UpdateModuleInput;
  UpdateProfileInput: UpdateProfileInput;
  UpdateWorkspaceNodeInput: UpdateWorkspaceNodeInput;
  User: ResolverTypeWrapper<User>;
  Void: ResolverTypeWrapper<Scalars['Void']>;
  Workspace: ResolverTypeWrapper<Workspace>;
  WorkspaceNode: ResolverTypeWrapper<WorkspaceNode>;
  WorkspaceNodeType: WorkspaceNodeType;
  WorkspaceS3Auth: ResolverTypeWrapper<WorkspaceS3Auth>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AuthResult: AuthResult;
  String: Scalars['String'];
  AvatarUploadResult: AvatarUploadResult;
  AwsCredentials: AwsCredentials;
  AwsUploadContentAuth: AwsUploadContentAuth;
  Challenge: Challenge;
  Int: Scalars['Int'];
  Float: Scalars['Float'];
  ChallengeFileInput: ChallengeFileInput;
  Boolean: Scalars['Boolean'];
  CreateWorkspaceInput: CreateWorkspaceInput;
  CreateWorkspaceNodeInput: CreateWorkspaceNodeInput;
  LibraryDefinition: LibraryDefinition;
  LibraryInput: LibraryInput;
  LoginInput: LoginInput;
  Mutation: {};
  MyProfile: MyProfile;
  NotificationSettings: NotificationSettings;
  NotificationSettingsInput: NotificationSettingsInput;
  OkResult: OkResult;
  PresignedPost: PresignedPost;
  PresignedPostField: PresignedPostField;
  Query: {};
  RegisterInput: RegisterInput;
  SubmitInput: SubmitInput;
  Subscription: {};
  TestProgressData: Scalars['TestProgressData'];
  UpdateChallengeInput: UpdateChallengeInput;
  UpdateModuleInput: UpdateModuleInput;
  UpdateProfileInput: UpdateProfileInput;
  UpdateWorkspaceNodeInput: UpdateWorkspaceNodeInput;
  User: User;
  Void: Scalars['Void'];
  Workspace: Workspace;
  WorkspaceNode: WorkspaceNode;
  WorkspaceS3Auth: WorkspaceS3Auth;
};

export type AuthResultResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['AuthResult'] = ResolversParentTypes['AuthResult']
> = {
  token?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AvatarUploadResultResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['AvatarUploadResult'] = ResolversParentTypes['AvatarUploadResult']
> = {
  avatarId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AwsCredentialsResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['AwsCredentials'] = ResolversParentTypes['AwsCredentials']
> = {
  accessKeyId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  secretAccessKey?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  sessionToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AwsUploadContentAuthResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['AwsUploadContentAuth'] = ResolversParentTypes['AwsUploadContentAuth']
> = {
  bucketName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  credentials?: Resolver<
    ResolversTypes['AwsCredentials'],
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ChallengeResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Challenge'] = ResolversParentTypes['Challenge']
> = {
  challengeId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  moduleId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  difficulty?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  practiceTime?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  detailsS3Key?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  htmlS3Key?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  solutionUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LibraryDefinitionResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['LibraryDefinition'] = ResolversParentTypes['LibraryDefinition']
> = {
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  types?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  source?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']
> = {
  login?: Resolver<
    ResolversTypes['AuthResult'],
    ParentType,
    ContextType,
    RequireFields<MutationLoginArgs, 'values'>
  >;
  register?: Resolver<
    ResolversTypes['AuthResult'],
    ParentType,
    ContextType,
    RequireFields<MutationRegisterArgs, 'values'>
  >;
  loginGithub?: Resolver<
    ResolversTypes['AuthResult'],
    ParentType,
    ContextType,
    RequireFields<MutationLoginGithubArgs, 'code'>
  >;
  loginGoogle?: Resolver<
    ResolversTypes['AuthResult'],
    ParentType,
    ContextType,
    RequireFields<MutationLoginGoogleArgs, 'accessToken'>
  >;
  registerGithub?: Resolver<
    ResolversTypes['AuthResult'],
    ParentType,
    ContextType,
    RequireFields<MutationRegisterGithubArgs, 'code'>
  >;
  registerGoogle?: Resolver<
    ResolversTypes['AuthResult'],
    ParentType,
    ContextType,
    RequireFields<MutationRegisterGoogleArgs, 'accessToken'>
  >;
  confirmEmail?: Resolver<
    ResolversTypes['AuthResult'],
    ParentType,
    ContextType,
    RequireFields<MutationConfirmEmailArgs, 'code'>
  >;
  logout?: Resolver<Maybe<ResolversTypes['Void']>, ParentType, ContextType>;
  resetPassword?: Resolver<
    Maybe<ResolversTypes['Void']>,
    ParentType,
    ContextType,
    RequireFields<MutationResetPasswordArgs, 'usernameOrEmail'>
  >;
  confirmResetPassword?: Resolver<
    ResolversTypes['AuthResult'],
    ParentType,
    ContextType,
    RequireFields<MutationConfirmResetPasswordArgs, 'code' | 'newPassword'>
  >;
  updateMyProfile?: Resolver<
    ResolversTypes['MyProfile'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateMyProfileArgs, 'values'>
  >;
  completeAvatarUpload?: Resolver<
    ResolversTypes['AvatarUploadResult'],
    ParentType,
    ContextType
  >;
  deleteAvatar?: Resolver<
    Maybe<ResolversTypes['Void']>,
    ParentType,
    ContextType
  >;
  changeUsername?: Resolver<
    Maybe<ResolversTypes['Void']>,
    ParentType,
    ContextType,
    RequireFields<MutationChangeUsernameArgs, 'username'>
  >;
  changeEmail?: Resolver<
    ResolversTypes['OkResult'],
    ParentType,
    ContextType,
    RequireFields<MutationChangeEmailArgs, 'email'>
  >;
  confirmChangeEmail?: Resolver<
    Maybe<ResolversTypes['Void']>,
    ParentType,
    ContextType,
    RequireFields<MutationConfirmChangeEmailArgs, 'code'>
  >;
  changePassword?: Resolver<
    Maybe<ResolversTypes['Void']>,
    ParentType,
    ContextType,
    RequireFields<MutationChangePasswordArgs, 'password'>
  >;
  updateNotificationSettings?: Resolver<
    Maybe<ResolversTypes['NotificationSettings']>,
    ParentType,
    ContextType,
    RequireFields<MutationUpdateNotificationSettingsArgs, 'values'>
  >;
  resendVerificationCode?: Resolver<
    Maybe<ResolversTypes['Void']>,
    ParentType,
    ContextType
  >;
  updateModule?: Resolver<
    Maybe<ResolversTypes['Void']>,
    ParentType,
    ContextType,
    RequireFields<MutationUpdateModuleArgs, 'values'>
  >;
  updateChallenge?: Resolver<
    Maybe<ResolversTypes['Void']>,
    ParentType,
    ContextType,
    RequireFields<MutationUpdateChallengeArgs, 'values'>
  >;
  getOrCreateWorkspace?: Resolver<
    ResolversTypes['Workspace'],
    ParentType,
    ContextType,
    RequireFields<MutationGetOrCreateWorkspaceArgs, 'values'>
  >;
  createWorkspaceNode?: Resolver<
    Maybe<ResolversTypes['Void']>,
    ParentType,
    ContextType,
    RequireFields<MutationCreateWorkspaceNodeArgs, 'values'>
  >;
  updateWorkspaceNode?: Resolver<
    Maybe<ResolversTypes['Void']>,
    ParentType,
    ContextType,
    RequireFields<MutationUpdateWorkspaceNodeArgs, 'values'>
  >;
  deleteWorkspaceNode?: Resolver<
    Maybe<ResolversTypes['Void']>,
    ParentType,
    ContextType,
    RequireFields<MutationDeleteWorkspaceNodeArgs, 'id'>
  >;
  submit?: Resolver<
    Maybe<ResolversTypes['Void']>,
    ParentType,
    ContextType,
    RequireFields<MutationSubmitArgs, 'values'>
  >;
  notifyTestProgress?: Resolver<
    Maybe<ResolversTypes['Void']>,
    ParentType,
    ContextType,
    RequireFields<MutationNotifyTestProgressArgs, 'notifyKey' | 'data'>
  >;
};

export type MyProfileResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['MyProfile'] = ResolversParentTypes['MyProfile']
> = {
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  about?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  country?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NotificationSettingsResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['NotificationSettings'] = ResolversParentTypes['NotificationSettings']
> = {
  newsletter?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type OkResultResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['OkResult'] = ResolversParentTypes['OkResult']
> = {
  ok?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PresignedPostResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['PresignedPost'] = ResolversParentTypes['PresignedPost']
> = {
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  fields?: Resolver<
    Array<ResolversTypes['PresignedPostField']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PresignedPostFieldResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['PresignedPostField'] = ResolversParentTypes['PresignedPostField']
> = {
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']
> = {
  me?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  ping?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  getMyProfile?: Resolver<ResolversTypes['MyProfile'], ParentType, ContextType>;
  getAvatarUploadUrl?: Resolver<
    ResolversTypes['PresignedPost'],
    ParentType,
    ContextType
  >;
  getNotificationSettings?: Resolver<
    ResolversTypes['NotificationSettings'],
    ParentType,
    ContextType
  >;
  getAwsUploadContentAuth?: Resolver<
    ResolversTypes['AwsUploadContentAuth'],
    ParentType,
    ContextType
  >;
  getWorkspaceS3Auth?: Resolver<
    ResolversTypes['WorkspaceS3Auth'],
    ParentType,
    ContextType,
    RequireFields<QueryGetWorkspaceS3AuthArgs, 'workspaceId'>
  >;
  getChallenge?: Resolver<
    ResolversTypes['Challenge'],
    ParentType,
    ContextType,
    RequireFields<QueryGetChallengeArgs, 'id'>
  >;
};

export type SubscriptionResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']
> = {
  testProgress?: SubscriptionResolver<
    ResolversTypes['TestProgressData'],
    'testProgress',
    ParentType,
    ContextType,
    RequireFields<SubscriptionTestProgressArgs, 'id'>
  >;
};

export interface TestProgressDataScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['TestProgressData'], any> {
  name: 'TestProgressData';
}

export type UserResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']
> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  avatarId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  isAdmin?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  isVerified?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface VoidScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['Void'], any> {
  name: 'Void';
}

export type WorkspaceResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Workspace'] = ResolversParentTypes['Workspace']
> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  isReady?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  items?: Resolver<
    Array<ResolversTypes['WorkspaceNode']>,
    ParentType,
    ContextType
  >;
  s3Auth?: Resolver<ResolversTypes['WorkspaceS3Auth'], ParentType, ContextType>;
  libraries?: Resolver<
    Array<ResolversTypes['LibraryDefinition']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type WorkspaceNodeResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['WorkspaceNode'] = ResolversParentTypes['WorkspaceNode']
> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  parentId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hash?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['WorkspaceNodeType'], ParentType, ContextType>;
  isLocked?: Resolver<
    Maybe<ResolversTypes['Boolean']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type WorkspaceS3AuthResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['WorkspaceS3Auth'] = ResolversParentTypes['WorkspaceS3Auth']
> = {
  bucketName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  credentials?: Resolver<
    ResolversTypes['AwsCredentials'],
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  AuthResult?: AuthResultResolvers<ContextType>;
  AvatarUploadResult?: AvatarUploadResultResolvers<ContextType>;
  AwsCredentials?: AwsCredentialsResolvers<ContextType>;
  AwsUploadContentAuth?: AwsUploadContentAuthResolvers<ContextType>;
  Challenge?: ChallengeResolvers<ContextType>;
  LibraryDefinition?: LibraryDefinitionResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  MyProfile?: MyProfileResolvers<ContextType>;
  NotificationSettings?: NotificationSettingsResolvers<ContextType>;
  OkResult?: OkResultResolvers<ContextType>;
  PresignedPost?: PresignedPostResolvers<ContextType>;
  PresignedPostField?: PresignedPostFieldResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  TestProgressData?: GraphQLScalarType;
  User?: UserResolvers<ContextType>;
  Void?: GraphQLScalarType;
  Workspace?: WorkspaceResolvers<ContextType>;
  WorkspaceNode?: WorkspaceNodeResolvers<ContextType>;
  WorkspaceS3Auth?: WorkspaceS3AuthResolvers<ContextType>;
};

/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
