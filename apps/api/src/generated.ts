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

export type MyProfile = {
  __typename?: 'MyProfile';
  name?: Maybe<Scalars['String']>;
  about?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
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
};

export type RegisterInput = {
  username: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
};

export type Subscription = {
  __typename?: 'Subscription';
  mock: Scalars['String'];
};

export type UpdateProfileInput = {
  name?: Maybe<Scalars['String']>;
  about?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  id: Scalars['String'];
  username: Scalars['String'];
  email: Scalars['String'];
  isAdmin?: Maybe<Scalars['Boolean']>;
  isVerified: Scalars['Boolean'];
};

export type ResolverTypeWrapper<T> = Promise<T> | T;

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
  LoginInput: LoginInput;
  Mutation: ResolverTypeWrapper<{}>;
  MyProfile: ResolverTypeWrapper<MyProfile>;
  PresignedPost: ResolverTypeWrapper<PresignedPost>;
  PresignedPostField: ResolverTypeWrapper<PresignedPostField>;
  Query: ResolverTypeWrapper<{}>;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  RegisterInput: RegisterInput;
  Subscription: ResolverTypeWrapper<{}>;
  UpdateProfileInput: UpdateProfileInput;
  User: ResolverTypeWrapper<User>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Void: ResolverTypeWrapper<Scalars['Void']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AuthResult: AuthResult;
  String: Scalars['String'];
  AvatarUploadResult: AvatarUploadResult;
  LoginInput: LoginInput;
  Mutation: {};
  MyProfile: MyProfile;
  PresignedPost: PresignedPost;
  PresignedPostField: PresignedPostField;
  Query: {};
  Float: Scalars['Float'];
  RegisterInput: RegisterInput;
  Subscription: {};
  UpdateProfileInput: UpdateProfileInput;
  User: User;
  Boolean: Scalars['Boolean'];
  Void: Scalars['Void'];
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
};

export type SubscriptionResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']
> = {
  mock?: SubscriptionResolver<
    ResolversTypes['String'],
    'mock',
    ParentType,
    ContextType
  >;
};

export type UserResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']
> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  isAdmin?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  isVerified?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface VoidScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['Void'], any> {
  name: 'Void';
}

export type Resolvers<ContextType = any> = {
  AuthResult?: AuthResultResolvers<ContextType>;
  AvatarUploadResult?: AvatarUploadResultResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  MyProfile?: MyProfileResolvers<ContextType>;
  PresignedPost?: PresignedPostResolvers<ContextType>;
  PresignedPostField?: PresignedPostFieldResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  Void?: GraphQLScalarType;
};

/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
