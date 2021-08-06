// import { gql } from '@apollo/client';
// import * as Apollo from '@apollo/client';
// export type Maybe<T> = T | null;
// export type Exact<T extends { [key: string]: unknown }> = {
//   [K in keyof T]: T[K];
// };
// export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
//   { [SubKey in K]?: Maybe<T[SubKey]> };
// export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
//   { [SubKey in K]: Maybe<T[SubKey]> };
// const defaultOptions = {};
// /** All built-in and custom scalars, mapped to their actual values */
// export type Scalars = {
//   ID: string;
//   String: string;
//   Boolean: boolean;
//   Int: number;
//   Float: number;
//   TestProgressData: any;
//   Void: any;
// };

// export type AuthResult = {
//   __typename?: 'AuthResult';
//   token: Scalars['String'];
//   user: User;
// };

// export type AvatarUploadResult = {
//   __typename?: 'AvatarUploadResult';
//   avatarId: Scalars['String'];
// };

// export type AwsCredentials = {
//   __typename?: 'AwsCredentials';
//   accessKeyId: Scalars['String'];
//   secretAccessKey: Scalars['String'];
//   sessionToken: Scalars['String'];
// };

// export type AwsUploadContentAuth = {
//   __typename?: 'AwsUploadContentAuth';
//   bucketName: Scalars['String'];
//   credentials: AwsCredentials;
// };

// export type Challenge = {
//   __typename?: 'Challenge';
//   id: Scalars['String'];
//   challengeId: Scalars['Int'];
//   moduleId: Scalars['Int'];
//   title: Scalars['String'];
//   description: Scalars['String'];
//   difficulty: Scalars['String'];
//   practiceTime: Scalars['Float'];
//   detailsS3Key: Scalars['String'];
//   htmlS3Key: Scalars['String'];
//   solutionUrl: Scalars['String'];
//   tests: Array<Scalars['String']>;
// };

// export type ChallengeFileInput = {
//   name: Scalars['String'];
//   directory: Scalars['String'];
//   s3Key: Scalars['String'];
//   isLocked?: Maybe<Scalars['Boolean']>;
// };

// export type CreateWorkspaceInput = {
//   challengeUniqId: Scalars['String'];
// };

// export type CreateWorkspaceNodeInput = {
//   id: Scalars['String'];
//   workspaceId: Scalars['String'];
//   name: Scalars['String'];
//   parentId?: Maybe<Scalars['String']>;
//   hash: Scalars['String'];
//   type: WorkspaceNodeType;
// };

// export type LibraryDefinition = {
//   __typename?: 'LibraryDefinition';
//   name: Scalars['String'];
//   types: Scalars['String'];
//   source: Scalars['String'];
// };

// export type LibraryInput = {
//   name: Scalars['String'];
//   types: Scalars['String'];
//   source: Scalars['String'];
// };

// export type LoginInput = {
//   usernameOrEmail: Scalars['String'];
//   password: Scalars['String'];
// };

// export type Mutation = {
//   __typename?: 'Mutation';
//   login: AuthResult;
//   register: AuthResult;
//   loginGithub: AuthResult;
//   loginGoogle: AuthResult;
//   registerGithub: AuthResult;
//   registerGoogle: AuthResult;
//   confirmEmail: AuthResult;
//   logout?: Maybe<Scalars['Void']>;
//   resetPassword?: Maybe<Scalars['Void']>;
//   confirmResetPassword: AuthResult;
//   updateMyProfile: MyProfile;
//   completeAvatarUpload: AvatarUploadResult;
//   deleteAvatar?: Maybe<Scalars['Void']>;
//   changeUsername?: Maybe<Scalars['Void']>;
//   changeEmail: OkResult;
//   confirmChangeEmail?: Maybe<Scalars['Void']>;
//   changePassword?: Maybe<Scalars['Void']>;
//   updateNotificationSettings?: Maybe<NotificationSettings>;
//   resendVerificationCode?: Maybe<Scalars['Void']>;
//   updateModule?: Maybe<Scalars['Void']>;
//   updateChallenge?: Maybe<Scalars['Void']>;
//   getOrCreateWorkspace: Workspace;
//   createWorkspaceNode?: Maybe<Scalars['Void']>;
//   updateWorkspaceNode?: Maybe<Scalars['Void']>;
//   deleteWorkspaceNode?: Maybe<Scalars['Void']>;
//   submit: Scalars['String'];
//   notifyTestProgress?: Maybe<Scalars['Void']>;
// };

// export type MutationLoginArgs = {
//   values: LoginInput;
// };

// export type MutationRegisterArgs = {
//   values: RegisterInput;
// };

// export type MutationLoginGithubArgs = {
//   code: Scalars['String'];
// };

// export type MutationLoginGoogleArgs = {
//   accessToken: Scalars['String'];
// };

// export type MutationRegisterGithubArgs = {
//   code: Scalars['String'];
// };

// export type MutationRegisterGoogleArgs = {
//   accessToken: Scalars['String'];
// };

// export type MutationConfirmEmailArgs = {
//   code: Scalars['String'];
// };

// export type MutationResetPasswordArgs = {
//   usernameOrEmail: Scalars['String'];
// };

// export type MutationConfirmResetPasswordArgs = {
//   code: Scalars['String'];
//   newPassword: Scalars['String'];
// };

// export type MutationUpdateMyProfileArgs = {
//   values: UpdateProfileInput;
// };

// export type MutationChangeUsernameArgs = {
//   username: Scalars['String'];
// };

// export type MutationChangeEmailArgs = {
//   email: Scalars['String'];
// };

// export type MutationConfirmChangeEmailArgs = {
//   code: Scalars['String'];
// };

// export type MutationChangePasswordArgs = {
//   password: Scalars['String'];
// };

// export type MutationUpdateNotificationSettingsArgs = {
//   values: NotificationSettingsInput;
// };

// export type MutationUpdateModuleArgs = {
//   values: UpdateModuleInput;
// };

// export type MutationUpdateChallengeArgs = {
//   values: UpdateChallengeInput;
// };

// export type MutationGetOrCreateWorkspaceArgs = {
//   values: CreateWorkspaceInput;
// };

// export type MutationCreateWorkspaceNodeArgs = {
//   values: CreateWorkspaceNodeInput;
// };

// export type MutationUpdateWorkspaceNodeArgs = {
//   values: UpdateWorkspaceNodeInput;
// };

// export type MutationDeleteWorkspaceNodeArgs = {
//   id: Scalars['String'];
// };

// export type MutationSubmitArgs = {
//   values: SubmitInput;
// };

// export type MutationNotifyTestProgressArgs = {
//   notifyKey: Scalars['String'];
//   data: Array<Scalars['TestProgressData']>;
// };

// export type MyProfile = {
//   __typename?: 'MyProfile';
//   name?: Maybe<Scalars['String']>;
//   about?: Maybe<Scalars['String']>;
//   country?: Maybe<Scalars['String']>;
//   url?: Maybe<Scalars['String']>;
// };

// export type NotificationSettings = {
//   __typename?: 'NotificationSettings';
//   newsletter: Scalars['Boolean'];
// };

// export type NotificationSettingsInput = {
//   newsletter: Scalars['Boolean'];
// };

// export type OkResult = {
//   __typename?: 'OkResult';
//   ok: Scalars['Boolean'];
// };

// export type PresignedPost = {
//   __typename?: 'PresignedPost';
//   url: Scalars['String'];
//   fields: Array<PresignedPostField>;
// };

// export type PresignedPostField = {
//   __typename?: 'PresignedPostField';
//   name: Scalars['String'];
//   value: Scalars['String'];
// };

// export type Query = {
//   __typename?: 'Query';
//   me: User;
//   ping: Scalars['Float'];
//   getMyProfile: MyProfile;
//   getAvatarUploadUrl: PresignedPost;
//   getNotificationSettings: NotificationSettings;
//   getAwsUploadContentAuth: AwsUploadContentAuth;
//   getWorkspaceS3Auth: WorkspaceS3Auth;
//   getChallenge: Challenge;
//   searchSubmissions: SearchSubmissionsResult;
// };

// export type QueryGetWorkspaceS3AuthArgs = {
//   workspaceId: Scalars['String'];
// };

// export type QueryGetChallengeArgs = {
//   id: Scalars['String'];
// };

// export type QuerySearchSubmissionsArgs = {
//   criteria: SearchSubmissionsCriteria;
// };

// export type RegisterInput = {
//   username: Scalars['String'];
//   email: Scalars['String'];
//   password: Scalars['String'];
// };

// export type SearchSubmissionsCriteria = {
//   limit: Scalars['Int'];
//   offset: Scalars['Int'];
//   sortBy: SubmissionSortBy;
// };

// export type SearchSubmissionsResult = {
//   __typename?: 'SearchSubmissionsResult';
//   items: Array<Submission>;
//   total: Scalars['Int'];
// };

// export type Submission = {
//   __typename?: 'Submission';
//   id: Scalars['String'];
//   createdAt: Scalars['String'];
//   status: SubmissionStatus;
//   nodes: Array<SubmissionNode>;
// };

// export type SubmissionNode = {
//   __typename?: 'SubmissionNode';
//   id: Scalars['String'];
//   name: Scalars['String'];
//   parentId?: Maybe<Scalars['String']>;
//   type: WorkspaceNodeType;
//   s3Key?: Maybe<Scalars['String']>;
// };

// export enum SubmissionSortBy {
//   Newest = 'newest',
//   Oldest = 'oldest',
// }

// export enum SubmissionStatus {
//   Queued = 'queued',
//   Running = 'running',
//   Pass = 'pass',
//   Fail = 'fail',
// }

// export type SubmitInput = {
//   workspaceId: Scalars['String'];
//   indexHtmlS3Key: Scalars['String'];
// };

// export type Subscription = {
//   __typename?: 'Subscription';
//   testProgress: Scalars['TestProgressData'];
// };

// export type SubscriptionTestProgressArgs = {
//   id: Scalars['String'];
// };

// export type UpdateChallengeInput = {
//   challengeId: Scalars['Int'];
//   moduleId: Scalars['Int'];
//   title: Scalars['String'];
//   description: Scalars['String'];
//   difficulty: Scalars['String'];
//   practiceTime: Scalars['Int'];
//   detailsS3Key: Scalars['String'];
//   htmlS3Key: Scalars['String'];
//   testS3Key: Scalars['String'];
//   solutionUrl: Scalars['String'];
//   files: Array<ChallengeFileInput>;
//   libraries: Array<LibraryInput>;
//   tests: Array<Scalars['String']>;
// };

// export type UpdateModuleInput = {
//   id: Scalars['Int'];
//   title: Scalars['String'];
//   description: Scalars['String'];
//   mainTechnology: Scalars['String'];
//   difficulty: Scalars['String'];
//   tags: Array<Scalars['String']>;
// };

// export type UpdateProfileInput = {
//   name?: Maybe<Scalars['String']>;
//   about?: Maybe<Scalars['String']>;
//   country?: Maybe<Scalars['String']>;
//   url?: Maybe<Scalars['String']>;
// };

// export type UpdateWorkspaceNodeInput = {
//   id: Scalars['String'];
//   name?: Maybe<Scalars['String']>;
//   parentId?: Maybe<Scalars['String']>;
//   hash?: Maybe<Scalars['String']>;
// };

// export type User = {
//   __typename?: 'User';
//   id: Scalars['String'];
//   username: Scalars['String'];
//   email: Scalars['String'];
//   avatarId?: Maybe<Scalars['String']>;
//   isAdmin?: Maybe<Scalars['Boolean']>;
//   isVerified: Scalars['Boolean'];
// };

// export type Workspace = {
//   __typename?: 'Workspace';
//   id: Scalars['String'];
//   items: Array<WorkspaceNode>;
//   s3Auth: WorkspaceS3Auth;
//   libraries: Array<LibraryDefinition>;
// };

// export type WorkspaceNode = {
//   __typename?: 'WorkspaceNode';
//   id: Scalars['String'];
//   name: Scalars['String'];
//   parentId?: Maybe<Scalars['String']>;
//   hash: Scalars['String'];
//   type: WorkspaceNodeType;
//   isLocked?: Maybe<Scalars['Boolean']>;
// };

// export enum WorkspaceNodeType {
//   File = 'file',
//   Directory = 'directory',
// }

// export type WorkspaceS3Auth = {
//   __typename?: 'WorkspaceS3Auth';
//   bucketName: Scalars['String'];
//   credentials: AwsCredentials;
// };

// export type LoginGithubMutationVariables = Exact<{
//   code: Scalars['String'];
// }>;

// export type LoginGithubMutation = { __typename?: 'Mutation' } & {
//   loginGithub: { __typename?: 'AuthResult' } & DefaultAuthResultFragment;
// };

// export type RegisterGithubMutationVariables = Exact<{
//   code: Scalars['String'];
// }>;

// export type RegisterGithubMutation = { __typename?: 'Mutation' } & {
//   registerGithub: { __typename?: 'AuthResult' } & DefaultAuthResultFragment;
// };

// export type LoginGoogleMutationVariables = Exact<{
//   accessToken: Scalars['String'];
// }>;

// export type LoginGoogleMutation = { __typename?: 'Mutation' } & {
//   loginGoogle: { __typename?: 'AuthResult' } & DefaultAuthResultFragment;
// };

// export type RegisterGoogleMutationVariables = Exact<{
//   accessToken: Scalars['String'];
// }>;

// export type RegisterGoogleMutation = { __typename?: 'Mutation' } & {
//   registerGoogle: { __typename?: 'AuthResult' } & DefaultAuthResultFragment;
// };

// export type ResendVerificationCodeMutationVariables = Exact<{
//   [key: string]: never;
// }>;

// export type ResendVerificationCodeMutation = { __typename?: 'Mutation' } & Pick<
//   Mutation,
//   'resendVerificationCode'
// >;

// export type LogoutMutationVariables = Exact<{ [key: string]: never }>;

// export type LogoutMutation = { __typename?: 'Mutation' } & Pick<
//   Mutation,
//   'logout'
// >;

// export type ConfirmEmailMutationVariables = Exact<{
//   code: Scalars['String'];
// }>;

// export type ConfirmEmailMutation = { __typename?: 'Mutation' } & {
//   confirmEmail: { __typename?: 'AuthResult' } & DefaultAuthResultFragment;
// };

// export type ConfirmChangeEmailMutationVariables = Exact<{
//   code: Scalars['String'];
// }>;

// export type ConfirmChangeEmailMutation = { __typename?: 'Mutation' } & Pick<
//   Mutation,
//   'confirmChangeEmail'
// >;

// export type GetOrCreateWorkspaceMutationVariables = Exact<{
//   id: Scalars['String'];
// }>;

// export type GetOrCreateWorkspaceMutation = { __typename?: 'Mutation' } & {
//   getOrCreateWorkspace: { __typename?: 'Workspace' } & Pick<Workspace, 'id'> & {
//       items: Array<
//         { __typename?: 'WorkspaceNode' } & Pick<
//           WorkspaceNode,
//           'id' | 'name' | 'parentId' | 'hash' | 'type' | 'isLocked'
//         >
//       >;
//       s3Auth: { __typename?: 'WorkspaceS3Auth' } & Pick<
//         WorkspaceS3Auth,
//         'bucketName'
//       > & {
//           credentials: { __typename?: 'AwsCredentials' } & Pick<
//             AwsCredentials,
//             'accessKeyId' | 'secretAccessKey' | 'sessionToken'
//           >;
//         };
//       libraries: Array<
//         { __typename?: 'LibraryDefinition' } & Pick<
//           LibraryDefinition,
//           'name' | 'types' | 'source'
//         >
//       >;
//     };
// };

// export type GetChallengeQueryVariables = Exact<{
//   id: Scalars['String'];
// }>;

// export type GetChallengeQuery = { __typename?: 'Query' } & {
//   getChallenge: { __typename?: 'Challenge' } & Pick<
//     Challenge,
//     | 'id'
//     | 'challengeId'
//     | 'moduleId'
//     | 'title'
//     | 'description'
//     | 'difficulty'
//     | 'practiceTime'
//     | 'detailsS3Key'
//     | 'htmlS3Key'
//     | 'solutionUrl'
//     | 'tests'
//   >;
// };

// export type SearchSubmissionsQueryVariables = Exact<{
//   criteria: SearchSubmissionsCriteria;
// }>;

// export type SearchSubmissionsQuery = { __typename?: 'Query' } & {
//   searchSubmissions: { __typename?: 'SearchSubmissionsResult' } & Pick<
//     SearchSubmissionsResult,
//     'total'
//   > & {
//       items: Array<
//         { __typename?: 'Submission' } & Pick<
//           Submission,
//           'id' | 'createdAt' | 'status'
//         > & {
//             nodes: Array<
//               { __typename?: 'SubmissionNode' } & Pick<
//                 SubmissionNode,
//                 'id' | 'name' | 'parentId' | 'type' | 's3Key'
//               >
//             >;
//           }
//       >;
//     };
// };

// export type SubmitMutationVariables = Exact<{
//   values: SubmitInput;
// }>;

// export type SubmitMutation = { __typename?: 'Mutation' } & Pick<
//   Mutation,
//   'submit'
// >;

// export type TestProgressSubscriptionVariables = Exact<{
//   id: Scalars['String'];
// }>;

// export type TestProgressSubscription = { __typename?: 'Subscription' } & Pick<
//   Subscription,
//   'testProgress'
// >;

// export type UpdateWorkspaceNodeMutationVariables = Exact<{
//   values: UpdateWorkspaceNodeInput;
// }>;

// export type UpdateWorkspaceNodeMutation = { __typename?: 'Mutation' } & Pick<
//   Mutation,
//   'updateWorkspaceNode'
// >;

// export type DeleteWorkspaceNodeMutationVariables = Exact<{
//   id: Scalars['String'];
// }>;

// export type DeleteWorkspaceNodeMutation = { __typename?: 'Mutation' } & Pick<
//   Mutation,
//   'deleteWorkspaceNode'
// >;

// export type CreateWorkspaceNodeMutationVariables = Exact<{
//   values: CreateWorkspaceNodeInput;
// }>;

// export type CreateWorkspaceNodeMutation = { __typename?: 'Mutation' } & Pick<
//   Mutation,
//   'createWorkspaceNode'
// >;

// export type ConfirmResetPasswordMutationVariables = Exact<{
//   code: Scalars['String'];
//   newPassword: Scalars['String'];
// }>;

// export type ConfirmResetPasswordMutation = { __typename?: 'Mutation' } & {
//   confirmResetPassword: {
//     __typename?: 'AuthResult';
//   } & DefaultAuthResultFragment;
// };

// export type LoginMutationVariables = Exact<{
//   loginValues: LoginInput;
// }>;

// export type LoginMutation = { __typename?: 'Mutation' } & {
//   login: { __typename?: 'AuthResult' } & DefaultAuthResultFragment;
// };

// export type GetModuleQueryVariables = Exact<{ [key: string]: never }>;

// export type GetModuleQuery = { __typename?: 'Query' } & {
//   me: { __typename?: 'User' } & Pick<User, 'id'>;
// };

// export type GetModulesQueryVariables = Exact<{ [key: string]: never }>;

// export type GetModulesQuery = { __typename?: 'Query' } & {
//   me: { __typename?: 'User' } & Pick<User, 'id'>;
// };

// export type GetProfileQueryVariables = Exact<{ [key: string]: never }>;

// export type GetProfileQuery = { __typename?: 'Query' } & {
//   me: { __typename?: 'User' } & Pick<User, 'id'>;
// };

// export type ResetPasswordMutationVariables = Exact<{
//   usernameOrEmail: Scalars['String'];
// }>;

// export type ResetPasswordMutation = { __typename?: 'Mutation' } & Pick<
//   Mutation,
//   'resetPassword'
// >;

// export type ChangeEmailMutationVariables = Exact<{
//   email: Scalars['String'];
// }>;

// export type ChangeEmailMutation = { __typename?: 'Mutation' } & {
//   changeEmail: { __typename?: 'OkResult' } & Pick<OkResult, 'ok'>;
// };

// export type ChangeUsernameMutationVariables = Exact<{
//   username: Scalars['String'];
// }>;

// export type ChangeUsernameMutation = { __typename?: 'Mutation' } & Pick<
//   Mutation,
//   'changeUsername'
// >;

// export type GetNotificationSettingsQueryVariables = Exact<{
//   [key: string]: never;
// }>;

// export type GetNotificationSettingsQuery = { __typename?: 'Query' } & {
//   getNotificationSettings: { __typename?: 'NotificationSettings' } & Pick<
//     NotificationSettings,
//     'newsletter'
//   >;
// };

// export type UpdateNotificationSettingsMutationVariables = Exact<{
//   values: NotificationSettingsInput;
// }>;

// export type UpdateNotificationSettingsMutation = { __typename?: 'Mutation' } & {
//   updateNotificationSettings?: Maybe<
//     { __typename?: 'NotificationSettings' } & Pick<
//       NotificationSettings,
//       'newsletter'
//     >
//   >;
// };

// export type ChangePasswordMutationVariables = Exact<{
//   password: Scalars['String'];
// }>;

// export type ChangePasswordMutation = { __typename?: 'Mutation' } & Pick<
//   Mutation,
//   'changePassword'
// >;

// export type GetMyProfileQueryVariables = Exact<{ [key: string]: never }>;

// export type GetMyProfileQuery = { __typename?: 'Query' } & {
//   getMyProfile: { __typename?: 'MyProfile' } & Pick<
//     MyProfile,
//     'name' | 'about' | 'country' | 'url'
//   >;
// };

// export type UpdateMyProfileMutationVariables = Exact<{
//   values: UpdateProfileInput;
// }>;

// export type UpdateMyProfileMutation = { __typename?: 'Mutation' } & {
//   updateMyProfile: { __typename?: 'MyProfile' } & Pick<
//     MyProfile,
//     'name' | 'about' | 'country' | 'url'
//   >;
// };

// export type GetAvatarUploadUrlQueryVariables = Exact<{ [key: string]: never }>;

// export type GetAvatarUploadUrlQuery = { __typename?: 'Query' } & {
//   getAvatarUploadUrl: { __typename?: 'PresignedPost' } & Pick<
//     PresignedPost,
//     'url'
//   > & {
//       fields: Array<
//         { __typename?: 'PresignedPostField' } & Pick<
//           PresignedPostField,
//           'name' | 'value'
//         >
//       >;
//     };
// };

// export type CompleteAvatarUploadMutationVariables = Exact<{
//   [key: string]: never;
// }>;

// export type CompleteAvatarUploadMutation = { __typename?: 'Mutation' } & {
//   completeAvatarUpload: { __typename?: 'AvatarUploadResult' } & Pick<
//     AvatarUploadResult,
//     'avatarId'
//   >;
// };

// export type DeleteAvatarMutationVariables = Exact<{ [key: string]: never }>;

// export type DeleteAvatarMutation = { __typename?: 'Mutation' } & Pick<
//   Mutation,
//   'deleteAvatar'
// >;

// export type RegisterMutationVariables = Exact<{
//   registerValues: RegisterInput;
// }>;

// export type RegisterMutation = { __typename?: 'Mutation' } & {
//   register: { __typename?: 'AuthResult' } & DefaultAuthResultFragment;
// };

// export type DefaultAuthResultFragment = { __typename?: 'AuthResult' } & Pick<
//   AuthResult,
//   'token'
// > & { user: { __typename?: 'User' } & AllUserPropsFragment };

// export type AppDataQueryVariables = Exact<{ [key: string]: never }>;

// export type AppDataQuery = { __typename?: 'Query' } & {
//   me: { __typename?: 'User' } & Pick<
//     User,
//     'id' | 'username' | 'email' | 'isAdmin' | 'isVerified' | 'avatarId'
//   >;
// };

// export type AllUserPropsFragment = { __typename?: 'User' } & Pick<
//   User,
//   'id' | 'username' | 'email' | 'isAdmin' | 'isVerified' | 'avatarId'
// >;

// export const AllUserPropsFragmentDoc = gql`
//   fragment allUserProps on User {
//     id
//     username
//     email
//     isAdmin
//     isVerified
//     avatarId
//   }
// `;
// export const DefaultAuthResultFragmentDoc = gql`
//   fragment DefaultAuthResult on AuthResult {
//     token
//     user {
//       ...allUserProps
//     }
//   }
//   ${AllUserPropsFragmentDoc}
// `;
// export const LoginGithubDocument = gql`
//   mutation LoginGithub($code: String!) {
//     loginGithub(code: $code) {
//       ...DefaultAuthResult
//     }
//   }
//   ${DefaultAuthResultFragmentDoc}
// `;
// export type LoginGithubMutationFn = Apollo.MutationFunction<
//   LoginGithubMutation,
//   LoginGithubMutationVariables
// >;

// /**
//  * __useLoginGithubMutation__
//  *
//  * To run a mutation, you first call `useLoginGithubMutation` within a React component and pass it any options that fit your needs.
//  * When your component renders, `useLoginGithubMutation` returns a tuple that includes:
//  * - A mutate function that you can call at any time to execute the mutation
//  * - An object with fields that represent the current status of the mutation's execution
//  *
//  * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
//  *
//  * @example
//  * const [loginGithubMutation, { data, loading, error }] = useLoginGithubMutation({
//  *   variables: {
//  *      code: // value for 'code'
//  *   },
//  * });
//  */
// export function useLoginGithubMutation(
//   baseOptions?: Apollo.MutationHookOptions<
//     LoginGithubMutation,
//     LoginGithubMutationVariables
//   >
// ) {
//   const options = { ...defaultOptions, ...baseOptions };
//   return Apollo.useMutation<LoginGithubMutation, LoginGithubMutationVariables>(
//     LoginGithubDocument,
//     options
//   );
// }
// export type LoginGithubMutationHookResult = ReturnType<
//   typeof useLoginGithubMutation
// >;
// export type LoginGithubMutationResult =
//   Apollo.MutationResult<LoginGithubMutation>;
// export type LoginGithubMutationOptions = Apollo.BaseMutationOptions<
//   LoginGithubMutation,
//   LoginGithubMutationVariables
// >;
// export const RegisterGithubDocument = gql`
//   mutation RegisterGithub($code: String!) {
//     registerGithub(code: $code) {
//       ...DefaultAuthResult
//     }
//   }
//   ${DefaultAuthResultFragmentDoc}
// `;
// export type RegisterGithubMutationFn = Apollo.MutationFunction<
//   RegisterGithubMutation,
//   RegisterGithubMutationVariables
// >;

// /**
//  * __useRegisterGithubMutation__
//  *
//  * To run a mutation, you first call `useRegisterGithubMutation` within a React component and pass it any options that fit your needs.
//  * When your component renders, `useRegisterGithubMutation` returns a tuple that includes:
//  * - A mutate function that you can call at any time to execute the mutation
//  * - An object with fields that represent the current status of the mutation's execution
//  *
//  * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
//  *
//  * @example
//  * const [registerGithubMutation, { data, loading, error }] = useRegisterGithubMutation({
//  *   variables: {
//  *      code: // value for 'code'
//  *   },
//  * });
//  */
// export function useRegisterGithubMutation(
//   baseOptions?: Apollo.MutationHookOptions<
//     RegisterGithubMutation,
//     RegisterGithubMutationVariables
//   >
// ) {
//   const options = { ...defaultOptions, ...baseOptions };
//   return Apollo.useMutation<
//     RegisterGithubMutation,
//     RegisterGithubMutationVariables
//   >(RegisterGithubDocument, options);
// }
// export type RegisterGithubMutationHookResult = ReturnType<
//   typeof useRegisterGithubMutation
// >;
// export type RegisterGithubMutationResult =
//   Apollo.MutationResult<RegisterGithubMutation>;
// export type RegisterGithubMutationOptions = Apollo.BaseMutationOptions<
//   RegisterGithubMutation,
//   RegisterGithubMutationVariables
// >;
// export const LoginGoogleDocument = gql`
//   mutation LoginGoogle($accessToken: String!) {
//     loginGoogle(accessToken: $accessToken) {
//       ...DefaultAuthResult
//     }
//   }
//   ${DefaultAuthResultFragmentDoc}
// `;
// export type LoginGoogleMutationFn = Apollo.MutationFunction<
//   LoginGoogleMutation,
//   LoginGoogleMutationVariables
// >;

// /**
//  * __useLoginGoogleMutation__
//  *
//  * To run a mutation, you first call `useLoginGoogleMutation` within a React component and pass it any options that fit your needs.
//  * When your component renders, `useLoginGoogleMutation` returns a tuple that includes:
//  * - A mutate function that you can call at any time to execute the mutation
//  * - An object with fields that represent the current status of the mutation's execution
//  *
//  * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
//  *
//  * @example
//  * const [loginGoogleMutation, { data, loading, error }] = useLoginGoogleMutation({
//  *   variables: {
//  *      accessToken: // value for 'accessToken'
//  *   },
//  * });
//  */
// export function useLoginGoogleMutation(
//   baseOptions?: Apollo.MutationHookOptions<
//     LoginGoogleMutation,
//     LoginGoogleMutationVariables
//   >
// ) {
//   const options = { ...defaultOptions, ...baseOptions };
//   return Apollo.useMutation<LoginGoogleMutation, LoginGoogleMutationVariables>(
//     LoginGoogleDocument,
//     options
//   );
// }
// export type LoginGoogleMutationHookResult = ReturnType<
//   typeof useLoginGoogleMutation
// >;
// export type LoginGoogleMutationResult =
//   Apollo.MutationResult<LoginGoogleMutation>;
// export type LoginGoogleMutationOptions = Apollo.BaseMutationOptions<
//   LoginGoogleMutation,
//   LoginGoogleMutationVariables
// >;
// export const RegisterGoogleDocument = gql`
//   mutation RegisterGoogle($accessToken: String!) {
//     registerGoogle(accessToken: $accessToken) {
//       ...DefaultAuthResult
//     }
//   }
//   ${DefaultAuthResultFragmentDoc}
// `;
// export type RegisterGoogleMutationFn = Apollo.MutationFunction<
//   RegisterGoogleMutation,
//   RegisterGoogleMutationVariables
// >;

// /**
//  * __useRegisterGoogleMutation__
//  *
//  * To run a mutation, you first call `useRegisterGoogleMutation` within a React component and pass it any options that fit your needs.
//  * When your component renders, `useRegisterGoogleMutation` returns a tuple that includes:
//  * - A mutate function that you can call at any time to execute the mutation
//  * - An object with fields that represent the current status of the mutation's execution
//  *
//  * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
//  *
//  * @example
//  * const [registerGoogleMutation, { data, loading, error }] = useRegisterGoogleMutation({
//  *   variables: {
//  *      accessToken: // value for 'accessToken'
//  *   },
//  * });
//  */
// export function useRegisterGoogleMutation(
//   baseOptions?: Apollo.MutationHookOptions<
//     RegisterGoogleMutation,
//     RegisterGoogleMutationVariables
//   >
// ) {
//   const options = { ...defaultOptions, ...baseOptions };
//   return Apollo.useMutation<
//     RegisterGoogleMutation,
//     RegisterGoogleMutationVariables
//   >(RegisterGoogleDocument, options);
// }
// export type RegisterGoogleMutationHookResult = ReturnType<
//   typeof useRegisterGoogleMutation
// >;
// export type RegisterGoogleMutationResult =
//   Apollo.MutationResult<RegisterGoogleMutation>;
// export type RegisterGoogleMutationOptions = Apollo.BaseMutationOptions<
//   RegisterGoogleMutation,
//   RegisterGoogleMutationVariables
// >;
// export const ResendVerificationCodeDocument = gql`
//   mutation ResendVerificationCode {
//     resendVerificationCode
//   }
// `;
// export type ResendVerificationCodeMutationFn = Apollo.MutationFunction<
//   ResendVerificationCodeMutation,
//   ResendVerificationCodeMutationVariables
// >;

// /**
//  * __useResendVerificationCodeMutation__
//  *
//  * To run a mutation, you first call `useResendVerificationCodeMutation` within a React component and pass it any options that fit your needs.
//  * When your component renders, `useResendVerificationCodeMutation` returns a tuple that includes:
//  * - A mutate function that you can call at any time to execute the mutation
//  * - An object with fields that represent the current status of the mutation's execution
//  *
//  * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
//  *
//  * @example
//  * const [resendVerificationCodeMutation, { data, loading, error }] = useResendVerificationCodeMutation({
//  *   variables: {
//  *   },
//  * });
//  */
// export function useResendVerificationCodeMutation(
//   baseOptions?: Apollo.MutationHookOptions<
//     ResendVerificationCodeMutation,
//     ResendVerificationCodeMutationVariables
//   >
// ) {
//   const options = { ...defaultOptions, ...baseOptions };
//   return Apollo.useMutation<
//     ResendVerificationCodeMutation,
//     ResendVerificationCodeMutationVariables
//   >(ResendVerificationCodeDocument, options);
// }
// export type ResendVerificationCodeMutationHookResult = ReturnType<
//   typeof useResendVerificationCodeMutation
// >;
// export type ResendVerificationCodeMutationResult =
//   Apollo.MutationResult<ResendVerificationCodeMutation>;
// export type ResendVerificationCodeMutationOptions = Apollo.BaseMutationOptions<
//   ResendVerificationCodeMutation,
//   ResendVerificationCodeMutationVariables
// >;
// export const LogoutDocument = gql`
//   mutation Logout {
//     logout
//   }
// `;
// export type LogoutMutationFn = Apollo.MutationFunction<
//   LogoutMutation,
//   LogoutMutationVariables
// >;

// /**
//  * __useLogoutMutation__
//  *
//  * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
//  * When your component renders, `useLogoutMutation` returns a tuple that includes:
//  * - A mutate function that you can call at any time to execute the mutation
//  * - An object with fields that represent the current status of the mutation's execution
//  *
//  * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
//  *
//  * @example
//  * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
//  *   variables: {
//  *   },
//  * });
//  */
// export function useLogoutMutation(
//   baseOptions?: Apollo.MutationHookOptions<
//     LogoutMutation,
//     LogoutMutationVariables
//   >
// ) {
//   const options = { ...defaultOptions, ...baseOptions };
//   return Apollo.useMutation<LogoutMutation, LogoutMutationVariables>(
//     LogoutDocument,
//     options
//   );
// }
// export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
// export type LogoutMutationResult = Apollo.MutationResult<LogoutMutation>;
// export type LogoutMutationOptions = Apollo.BaseMutationOptions<
//   LogoutMutation,
//   LogoutMutationVariables
// >;
// export const ConfirmEmailDocument = gql`
//   mutation ConfirmEmail($code: String!) {
//     confirmEmail(code: $code) {
//       ...DefaultAuthResult
//     }
//   }
//   ${DefaultAuthResultFragmentDoc}
// `;
// export type ConfirmEmailMutationFn = Apollo.MutationFunction<
//   ConfirmEmailMutation,
//   ConfirmEmailMutationVariables
// >;

// /**
//  * __useConfirmEmailMutation__
//  *
//  * To run a mutation, you first call `useConfirmEmailMutation` within a React component and pass it any options that fit your needs.
//  * When your component renders, `useConfirmEmailMutation` returns a tuple that includes:
//  * - A mutate function that you can call at any time to execute the mutation
//  * - An object with fields that represent the current status of the mutation's execution
//  *
//  * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
//  *
//  * @example
//  * const [confirmEmailMutation, { data, loading, error }] = useConfirmEmailMutation({
//  *   variables: {
//  *      code: // value for 'code'
//  *   },
//  * });
//  */
// export function useConfirmEmailMutation(
//   baseOptions?: Apollo.MutationHookOptions<
//     ConfirmEmailMutation,
//     ConfirmEmailMutationVariables
//   >
// ) {
//   const options = { ...defaultOptions, ...baseOptions };
//   return Apollo.useMutation<
//     ConfirmEmailMutation,
//     ConfirmEmailMutationVariables
//   >(ConfirmEmailDocument, options);
// }
// export type ConfirmEmailMutationHookResult = ReturnType<
//   typeof useConfirmEmailMutation
// >;
// export type ConfirmEmailMutationResult =
//   Apollo.MutationResult<ConfirmEmailMutation>;
// export type ConfirmEmailMutationOptions = Apollo.BaseMutationOptions<
//   ConfirmEmailMutation,
//   ConfirmEmailMutationVariables
// >;
// export const ConfirmChangeEmailDocument = gql`
//   mutation ConfirmChangeEmail($code: String!) {
//     confirmChangeEmail(code: $code)
//   }
// `;
// export type ConfirmChangeEmailMutationFn = Apollo.MutationFunction<
//   ConfirmChangeEmailMutation,
//   ConfirmChangeEmailMutationVariables
// >;

// /**
//  * __useConfirmChangeEmailMutation__
//  *
//  * To run a mutation, you first call `useConfirmChangeEmailMutation` within a React component and pass it any options that fit your needs.
//  * When your component renders, `useConfirmChangeEmailMutation` returns a tuple that includes:
//  * - A mutate function that you can call at any time to execute the mutation
//  * - An object with fields that represent the current status of the mutation's execution
//  *
//  * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
//  *
//  * @example
//  * const [confirmChangeEmailMutation, { data, loading, error }] = useConfirmChangeEmailMutation({
//  *   variables: {
//  *      code: // value for 'code'
//  *   },
//  * });
//  */
// export function useConfirmChangeEmailMutation(
//   baseOptions?: Apollo.MutationHookOptions<
//     ConfirmChangeEmailMutation,
//     ConfirmChangeEmailMutationVariables
//   >
// ) {
//   const options = { ...defaultOptions, ...baseOptions };
//   return Apollo.useMutation<
//     ConfirmChangeEmailMutation,
//     ConfirmChangeEmailMutationVariables
//   >(ConfirmChangeEmailDocument, options);
// }
// export type ConfirmChangeEmailMutationHookResult = ReturnType<
//   typeof useConfirmChangeEmailMutation
// >;
// export type ConfirmChangeEmailMutationResult =
//   Apollo.MutationResult<ConfirmChangeEmailMutation>;
// export type ConfirmChangeEmailMutationOptions = Apollo.BaseMutationOptions<
//   ConfirmChangeEmailMutation,
//   ConfirmChangeEmailMutationVariables
// >;
// export const GetOrCreateWorkspaceDocument = gql`
//   mutation GetOrCreateWorkspace($id: String!) {
//     getOrCreateWorkspace(values: { challengeUniqId: $id }) {
//       id
//       items {
//         id
//         name
//         parentId
//         hash
//         type
//         isLocked
//       }
//       s3Auth {
//         bucketName
//         credentials {
//           accessKeyId
//           secretAccessKey
//           sessionToken
//         }
//       }
//       libraries {
//         name
//         types
//         source
//       }
//     }
//   }
// `;
// export type GetOrCreateWorkspaceMutationFn = Apollo.MutationFunction<
//   GetOrCreateWorkspaceMutation,
//   GetOrCreateWorkspaceMutationVariables
// >;

// /**
//  * __useGetOrCreateWorkspaceMutation__
//  *
//  * To run a mutation, you first call `useGetOrCreateWorkspaceMutation` within a React component and pass it any options that fit your needs.
//  * When your component renders, `useGetOrCreateWorkspaceMutation` returns a tuple that includes:
//  * - A mutate function that you can call at any time to execute the mutation
//  * - An object with fields that represent the current status of the mutation's execution
//  *
//  * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
//  *
//  * @example
//  * const [getOrCreateWorkspaceMutation, { data, loading, error }] = useGetOrCreateWorkspaceMutation({
//  *   variables: {
//  *      id: // value for 'id'
//  *   },
//  * });
//  */
// export function useGetOrCreateWorkspaceMutation(
//   baseOptions?: Apollo.MutationHookOptions<
//     GetOrCreateWorkspaceMutation,
//     GetOrCreateWorkspaceMutationVariables
//   >
// ) {
//   const options = { ...defaultOptions, ...baseOptions };
//   return Apollo.useMutation<
//     GetOrCreateWorkspaceMutation,
//     GetOrCreateWorkspaceMutationVariables
//   >(GetOrCreateWorkspaceDocument, options);
// }
// export type GetOrCreateWorkspaceMutationHookResult = ReturnType<
//   typeof useGetOrCreateWorkspaceMutation
// >;
// export type GetOrCreateWorkspaceMutationResult =
//   Apollo.MutationResult<GetOrCreateWorkspaceMutation>;
// export type GetOrCreateWorkspaceMutationOptions = Apollo.BaseMutationOptions<
//   GetOrCreateWorkspaceMutation,
//   GetOrCreateWorkspaceMutationVariables
// >;
// export const GetChallengeDocument = gql`
//   query GetChallenge($id: String!) {
//     getChallenge(id: $id) {
//       id
//       challengeId
//       moduleId
//       title
//       description
//       difficulty
//       practiceTime
//       detailsS3Key
//       htmlS3Key
//       solutionUrl
//       tests
//     }
//   }
// `;

// /**
//  * __useGetChallengeQuery__
//  *
//  * To run a query within a React component, call `useGetChallengeQuery` and pass it any options that fit your needs.
//  * When your component renders, `useGetChallengeQuery` returns an object from Apollo Client that contains loading, error, and data properties
//  * you can use to render your UI.
//  *
//  * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
//  *
//  * @example
//  * const { data, loading, error } = useGetChallengeQuery({
//  *   variables: {
//  *      id: // value for 'id'
//  *   },
//  * });
//  */
// export function useGetChallengeQuery(
//   baseOptions: Apollo.QueryHookOptions<
//     GetChallengeQuery,
//     GetChallengeQueryVariables
//   >
// ) {
//   const options = { ...defaultOptions, ...baseOptions };
//   return Apollo.useQuery<GetChallengeQuery, GetChallengeQueryVariables>(
//     GetChallengeDocument,
//     options
//   );
// }
// export function useGetChallengeLazyQuery(
//   baseOptions?: Apollo.LazyQueryHookOptions<
//     GetChallengeQuery,
//     GetChallengeQueryVariables
//   >
// ) {
//   const options = { ...defaultOptions, ...baseOptions };
//   return Apollo.useLazyQuery<GetChallengeQuery, GetChallengeQueryVariables>(
//     GetChallengeDocument,
//     options
//   );
// }
// export type GetChallengeQueryHookResult = ReturnType<
//   typeof useGetChallengeQuery
// >;
// export type GetChallengeLazyQueryHookResult = ReturnType<
//   typeof useGetChallengeLazyQuery
// >;
// export type GetChallengeQueryResult = Apollo.QueryResult<
//   GetChallengeQuery,
//   GetChallengeQueryVariables
// >;
// export const SearchSubmissionsDocument = gql`
//   query SearchSubmissions($criteria: SearchSubmissionsCriteria!) {
//     searchSubmissions(criteria: $criteria) {
//       items {
//         id
//         createdAt
//         status
//         nodes {
//           id
//           name
//           parentId
//           type
//           s3Key
//         }
//       }
//       total
//     }
//   }
// `;

// /**
//  * __useSearchSubmissionsQuery__
//  *
//  * To run a query within a React component, call `useSearchSubmissionsQuery` and pass it any options that fit your needs.
//  * When your component renders, `useSearchSubmissionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
//  * you can use to render your UI.
//  *
//  * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
//  *
//  * @example
//  * const { data, loading, error } = useSearchSubmissionsQuery({
//  *   variables: {
//  *      criteria: // value for 'criteria'
//  *   },
//  * });
//  */
// export function useSearchSubmissionsQuery(
//   baseOptions: Apollo.QueryHookOptions<
//     SearchSubmissionsQuery,
//     SearchSubmissionsQueryVariables
//   >
// ) {
//   const options = { ...defaultOptions, ...baseOptions };
//   return Apollo.useQuery<
//     SearchSubmissionsQuery,
//     SearchSubmissionsQueryVariables
//   >(SearchSubmissionsDocument, options);
// }
// export function useSearchSubmissionsLazyQuery(
//   baseOptions?: Apollo.LazyQueryHookOptions<
//     SearchSubmissionsQuery,
//     SearchSubmissionsQueryVariables
//   >
// ) {
//   const options = { ...defaultOptions, ...baseOptions };
//   return Apollo.useLazyQuery<
//     SearchSubmissionsQuery,
//     SearchSubmissionsQueryVariables
//   >(SearchSubmissionsDocument, options);
// }
// export type SearchSubmissionsQueryHookResult = ReturnType<
//   typeof useSearchSubmissionsQuery
// >;
// export type SearchSubmissionsLazyQueryHookResult = ReturnType<
//   typeof useSearchSubmissionsLazyQuery
// >;
// export type SearchSubmissionsQueryResult = Apollo.QueryResult<
//   SearchSubmissionsQuery,
//   SearchSubmissionsQueryVariables
// >;
// export const SubmitDocument = gql`
//   mutation Submit($values: SubmitInput!) {
//     submit(values: $values)
//   }
// `;
// export type SubmitMutationFn = Apollo.MutationFunction<
//   SubmitMutation,
//   SubmitMutationVariables
// >;

// /**
//  * __useSubmitMutation__
//  *
//  * To run a mutation, you first call `useSubmitMutation` within a React component and pass it any options that fit your needs.
//  * When your component renders, `useSubmitMutation` returns a tuple that includes:
//  * - A mutate function that you can call at any time to execute the mutation
//  * - An object with fields that represent the current status of the mutation's execution
//  *
//  * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
//  *
//  * @example
//  * const [submitMutation, { data, loading, error }] = useSubmitMutation({
//  *   variables: {
//  *      values: // value for 'values'
//  *   },
//  * });
//  */
// export function useSubmitMutation(
//   baseOptions?: Apollo.MutationHookOptions<
//     SubmitMutation,
//     SubmitMutationVariables
//   >
// ) {
//   const options = { ...defaultOptions, ...baseOptions };
//   return Apollo.useMutation<SubmitMutation, SubmitMutationVariables>(
//     SubmitDocument,
//     options
//   );
// }
// export type SubmitMutationHookResult = ReturnType<typeof useSubmitMutation>;
// export type SubmitMutationResult = Apollo.MutationResult<SubmitMutation>;
// export type SubmitMutationOptions = Apollo.BaseMutationOptions<
//   SubmitMutation,
//   SubmitMutationVariables
// >;
// export const TestProgressDocument = gql`
//   subscription TestProgress($id: String!) {
//     testProgress(id: $id)
//   }
// `;

// /**
//  * __useTestProgressSubscription__
//  *
//  * To run a query within a React component, call `useTestProgressSubscription` and pass it any options that fit your needs.
//  * When your component renders, `useTestProgressSubscription` returns an object from Apollo Client that contains loading, error, and data properties
//  * you can use to render your UI.
//  *
//  * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
//  *
//  * @example
//  * const { data, loading, error } = useTestProgressSubscription({
//  *   variables: {
//  *      id: // value for 'id'
//  *   },
//  * });
//  */
// export function useTestProgressSubscription(
//   baseOptions: Apollo.SubscriptionHookOptions<
//     TestProgressSubscription,
//     TestProgressSubscriptionVariables
//   >
// ) {
//   const options = { ...defaultOptions, ...baseOptions };
//   return Apollo.useSubscription<
//     TestProgressSubscription,
//     TestProgressSubscriptionVariables
//   >(TestProgressDocument, options);
// }
// export type TestProgressSubscriptionHookResult = ReturnType<
//   typeof useTestProgressSubscription
// >;
// export type TestProgressSubscriptionResult =
//   Apollo.SubscriptionResult<TestProgressSubscription>;
// export const UpdateWorkspaceNodeDocument = gql`
//   mutation UpdateWorkspaceNode($values: UpdateWorkspaceNodeInput!) {
//     updateWorkspaceNode(values: $values)
//   }
// `;
// export type UpdateWorkspaceNodeMutationFn = Apollo.MutationFunction<
//   UpdateWorkspaceNodeMutation,
//   UpdateWorkspaceNodeMutationVariables
// >;

// /**
//  * __useUpdateWorkspaceNodeMutation__
//  *
//  * To run a mutation, you first call `useUpdateWorkspaceNodeMutation` within a React component and pass it any options that fit your needs.
//  * When your component renders, `useUpdateWorkspaceNodeMutation` returns a tuple that includes:
//  * - A mutate function that you can call at any time to execute the mutation
//  * - An object with fields that represent the current status of the mutation's execution
//  *
//  * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
//  *
//  * @example
//  * const [updateWorkspaceNodeMutation, { data, loading, error }] = useUpdateWorkspaceNodeMutation({
//  *   variables: {
//  *      values: // value for 'values'
//  *   },
//  * });
//  */
// export function useUpdateWorkspaceNodeMutation(
//   baseOptions?: Apollo.MutationHookOptions<
//     UpdateWorkspaceNodeMutation,
//     UpdateWorkspaceNodeMutationVariables
//   >
// ) {
//   const options = { ...defaultOptions, ...baseOptions };
//   return Apollo.useMutation<
//     UpdateWorkspaceNodeMutation,
//     UpdateWorkspaceNodeMutationVariables
//   >(UpdateWorkspaceNodeDocument, options);
// }
// export type UpdateWorkspaceNodeMutationHookResult = ReturnType<
//   typeof useUpdateWorkspaceNodeMutation
// >;
// export type UpdateWorkspaceNodeMutationResult =
//   Apollo.MutationResult<UpdateWorkspaceNodeMutation>;
// export type UpdateWorkspaceNodeMutationOptions = Apollo.BaseMutationOptions<
//   UpdateWorkspaceNodeMutation,
//   UpdateWorkspaceNodeMutationVariables
// >;
// export const DeleteWorkspaceNodeDocument = gql`
//   mutation DeleteWorkspaceNode($id: String!) {
//     deleteWorkspaceNode(id: $id)
//   }
// `;
// export type DeleteWorkspaceNodeMutationFn = Apollo.MutationFunction<
//   DeleteWorkspaceNodeMutation,
//   DeleteWorkspaceNodeMutationVariables
// >;

// /**
//  * __useDeleteWorkspaceNodeMutation__
//  *
//  * To run a mutation, you first call `useDeleteWorkspaceNodeMutation` within a React component and pass it any options that fit your needs.
//  * When your component renders, `useDeleteWorkspaceNodeMutation` returns a tuple that includes:
//  * - A mutate function that you can call at any time to execute the mutation
//  * - An object with fields that represent the current status of the mutation's execution
//  *
//  * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
//  *
//  * @example
//  * const [deleteWorkspaceNodeMutation, { data, loading, error }] = useDeleteWorkspaceNodeMutation({
//  *   variables: {
//  *      id: // value for 'id'
//  *   },
//  * });
//  */
// export function useDeleteWorkspaceNodeMutation(
//   baseOptions?: Apollo.MutationHookOptions<
//     DeleteWorkspaceNodeMutation,
//     DeleteWorkspaceNodeMutationVariables
//   >
// ) {
//   const options = { ...defaultOptions, ...baseOptions };
//   return Apollo.useMutation<
//     DeleteWorkspaceNodeMutation,
//     DeleteWorkspaceNodeMutationVariables
//   >(DeleteWorkspaceNodeDocument, options);
// }
// export type DeleteWorkspaceNodeMutationHookResult = ReturnType<
//   typeof useDeleteWorkspaceNodeMutation
// >;
// export type DeleteWorkspaceNodeMutationResult =
//   Apollo.MutationResult<DeleteWorkspaceNodeMutation>;
// export type DeleteWorkspaceNodeMutationOptions = Apollo.BaseMutationOptions<
//   DeleteWorkspaceNodeMutation,
//   DeleteWorkspaceNodeMutationVariables
// >;
// export const CreateWorkspaceNodeDocument = gql`
//   mutation CreateWorkspaceNode($values: CreateWorkspaceNodeInput!) {
//     createWorkspaceNode(values: $values)
//   }
// `;
// export type CreateWorkspaceNodeMutationFn = Apollo.MutationFunction<
//   CreateWorkspaceNodeMutation,
//   CreateWorkspaceNodeMutationVariables
// >;

// /**
//  * __useCreateWorkspaceNodeMutation__
//  *
//  * To run a mutation, you first call `useCreateWorkspaceNodeMutation` within a React component and pass it any options that fit your needs.
//  * When your component renders, `useCreateWorkspaceNodeMutation` returns a tuple that includes:
//  * - A mutate function that you can call at any time to execute the mutation
//  * - An object with fields that represent the current status of the mutation's execution
//  *
//  * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
//  *
//  * @example
//  * const [createWorkspaceNodeMutation, { data, loading, error }] = useCreateWorkspaceNodeMutation({
//  *   variables: {
//  *      values: // value for 'values'
//  *   },
//  * });
//  */
// export function useCreateWorkspaceNodeMutation(
//   baseOptions?: Apollo.MutationHookOptions<
//     CreateWorkspaceNodeMutation,
//     CreateWorkspaceNodeMutationVariables
//   >
// ) {
//   const options = { ...defaultOptions, ...baseOptions };
//   return Apollo.useMutation<
//     CreateWorkspaceNodeMutation,
//     CreateWorkspaceNodeMutationVariables
//   >(CreateWorkspaceNodeDocument, options);
// }
// export type CreateWorkspaceNodeMutationHookResult = ReturnType<
//   typeof useCreateWorkspaceNodeMutation
// >;
// export type CreateWorkspaceNodeMutationResult =
//   Apollo.MutationResult<CreateWorkspaceNodeMutation>;
// export type CreateWorkspaceNodeMutationOptions = Apollo.BaseMutationOptions<
//   CreateWorkspaceNodeMutation,
//   CreateWorkspaceNodeMutationVariables
// >;
// export const ConfirmResetPasswordDocument = gql`
//   mutation ConfirmResetPassword($code: String!, $newPassword: String!) {
//     confirmResetPassword(code: $code, newPassword: $newPassword) {
//       ...DefaultAuthResult
//     }
//   }
//   ${DefaultAuthResultFragmentDoc}
// `;
// export type ConfirmResetPasswordMutationFn = Apollo.MutationFunction<
//   ConfirmResetPasswordMutation,
//   ConfirmResetPasswordMutationVariables
// >;

// /**
//  * __useConfirmResetPasswordMutation__
//  *
//  * To run a mutation, you first call `useConfirmResetPasswordMutation` within a React component and pass it any options that fit your needs.
//  * When your component renders, `useConfirmResetPasswordMutation` returns a tuple that includes:
//  * - A mutate function that you can call at any time to execute the mutation
//  * - An object with fields that represent the current status of the mutation's execution
//  *
//  * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
//  *
//  * @example
//  * const [confirmResetPasswordMutation, { data, loading, error }] = useConfirmResetPasswordMutation({
//  *   variables: {
//  *      code: // value for 'code'
//  *      newPassword: // value for 'newPassword'
//  *   },
//  * });
//  */
// export function useConfirmResetPasswordMutation(
//   baseOptions?: Apollo.MutationHookOptions<
//     ConfirmResetPasswordMutation,
//     ConfirmResetPasswordMutationVariables
//   >
// ) {
//   const options = { ...defaultOptions, ...baseOptions };
//   return Apollo.useMutation<
//     ConfirmResetPasswordMutation,
//     ConfirmResetPasswordMutationVariables
//   >(ConfirmResetPasswordDocument, options);
// }
// export type ConfirmResetPasswordMutationHookResult = ReturnType<
//   typeof useConfirmResetPasswordMutation
// >;
// export type ConfirmResetPasswordMutationResult =
//   Apollo.MutationResult<ConfirmResetPasswordMutation>;
// export type ConfirmResetPasswordMutationOptions = Apollo.BaseMutationOptions<
//   ConfirmResetPasswordMutation,
//   ConfirmResetPasswordMutationVariables
// >;
// export const LoginDocument = gql`
//   mutation Login($loginValues: LoginInput!) {
//     login(values: $loginValues) {
//       ...DefaultAuthResult
//     }
//   }
//   ${DefaultAuthResultFragmentDoc}
// `;
// export type LoginMutationFn = Apollo.MutationFunction<
//   LoginMutation,
//   LoginMutationVariables
// >;

// /**
//  * __useLoginMutation__
//  *
//  * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
//  * When your component renders, `useLoginMutation` returns a tuple that includes:
//  * - A mutate function that you can call at any time to execute the mutation
//  * - An object with fields that represent the current status of the mutation's execution
//  *
//  * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
//  *
//  * @example
//  * const [loginMutation, { data, loading, error }] = useLoginMutation({
//  *   variables: {
//  *      loginValues: // value for 'loginValues'
//  *   },
//  * });
//  */
// export function useLoginMutation(
//   baseOptions?: Apollo.MutationHookOptions<
//     LoginMutation,
//     LoginMutationVariables
//   >
// ) {
//   const options = { ...defaultOptions, ...baseOptions };
//   return Apollo.useMutation<LoginMutation, LoginMutationVariables>(
//     LoginDocument,
//     options
//   );
// }
// export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
// export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
// export type LoginMutationOptions = Apollo.BaseMutationOptions<
//   LoginMutation,
//   LoginMutationVariables
// >;
// export const GetModuleDocument = gql`
//   query GetModule {
//     me {
//       id
//     }
//   }
// `;

// /**
//  * __useGetModuleQuery__
//  *
//  * To run a query within a React component, call `useGetModuleQuery` and pass it any options that fit your needs.
//  * When your component renders, `useGetModuleQuery` returns an object from Apollo Client that contains loading, error, and data properties
//  * you can use to render your UI.
//  *
//  * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
//  *
//  * @example
//  * const { data, loading, error } = useGetModuleQuery({
//  *   variables: {
//  *   },
//  * });
//  */
// export function useGetModuleQuery(
//   baseOptions?: Apollo.QueryHookOptions<GetModuleQuery, GetModuleQueryVariables>
// ) {
//   const options = { ...defaultOptions, ...baseOptions };
//   return Apollo.useQuery<GetModuleQuery, GetModuleQueryVariables>(
//     GetModuleDocument,
//     options
//   );
// }
// export function useGetModuleLazyQuery(
//   baseOptions?: Apollo.LazyQueryHookOptions<
//     GetModuleQuery,
//     GetModuleQueryVariables
//   >
// ) {
//   const options = { ...defaultOptions, ...baseOptions };
//   return Apollo.useLazyQuery<GetModuleQuery, GetModuleQueryVariables>(
//     GetModuleDocument,
//     options
//   );
// }
// export type GetModuleQueryHookResult = ReturnType<typeof useGetModuleQuery>;
// export type GetModuleLazyQueryHookResult = ReturnType<
//   typeof useGetModuleLazyQuery
// >;
// export type GetModuleQueryResult = Apollo.QueryResult<
//   GetModuleQuery,
//   GetModuleQueryVariables
// >;
// export const GetModulesDocument = gql`
//   query GetModules {
//     me {
//       id
//     }
//   }
// `;

// /**
//  * __useGetModulesQuery__
//  *
//  * To run a query within a React component, call `useGetModulesQuery` and pass it any options that fit your needs.
//  * When your component renders, `useGetModulesQuery` returns an object from Apollo Client that contains loading, error, and data properties
//  * you can use to render your UI.
//  *
//  * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
//  *
//  * @example
//  * const { data, loading, error } = useGetModulesQuery({
//  *   variables: {
//  *   },
//  * });
//  */
// export function useGetModulesQuery(
//   baseOptions?: Apollo.QueryHookOptions<
//     GetModulesQuery,
//     GetModulesQueryVariables
//   >
// ) {
//   const options = { ...defaultOptions, ...baseOptions };
//   return Apollo.useQuery<GetModulesQuery, GetModulesQueryVariables>(
//     GetModulesDocument,
//     options
//   );
// }
// export function useGetModulesLazyQuery(
//   baseOptions?: Apollo.LazyQueryHookOptions<
//     GetModulesQuery,
//     GetModulesQueryVariables
//   >
// ) {
//   const options = { ...defaultOptions, ...baseOptions };
//   return Apollo.useLazyQuery<GetModulesQuery, GetModulesQueryVariables>(
//     GetModulesDocument,
//     options
//   );
// }
// export type GetModulesQueryHookResult = ReturnType<typeof useGetModulesQuery>;
// export type GetModulesLazyQueryHookResult = ReturnType<
//   typeof useGetModulesLazyQuery
// >;
// export type GetModulesQueryResult = Apollo.QueryResult<
//   GetModulesQuery,
//   GetModulesQueryVariables
// >;
// export const GetProfileDocument = gql`
//   query GetProfile {
//     me {
//       id
//     }
//   }
// `;

// /**
//  * __useGetProfileQuery__
//  *
//  * To run a query within a React component, call `useGetProfileQuery` and pass it any options that fit your needs.
//  * When your component renders, `useGetProfileQuery` returns an object from Apollo Client that contains loading, error, and data properties
//  * you can use to render your UI.
//  *
//  * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
//  *
//  * @example
//  * const { data, loading, error } = useGetProfileQuery({
//  *   variables: {
//  *   },
//  * });
//  */
// export function useGetProfileQuery(
//   baseOptions?: Apollo.QueryHookOptions<
//     GetProfileQuery,
//     GetProfileQueryVariables
//   >
// ) {
//   const options = { ...defaultOptions, ...baseOptions };
//   return Apollo.useQuery<GetProfileQuery, GetProfileQueryVariables>(
//     GetProfileDocument,
//     options
//   );
// }
// export function useGetProfileLazyQuery(
//   baseOptions?: Apollo.LazyQueryHookOptions<
//     GetProfileQuery,
//     GetProfileQueryVariables
//   >
// ) {
//   const options = { ...defaultOptions, ...baseOptions };
//   return Apollo.useLazyQuery<GetProfileQuery, GetProfileQueryVariables>(
//     GetProfileDocument,
//     options
//   );
// }
// export type GetProfileQueryHookResult = ReturnType<typeof useGetProfileQuery>;
// export type GetProfileLazyQueryHookResult = ReturnType<
//   typeof useGetProfileLazyQuery
// >;
// export type GetProfileQueryResult = Apollo.QueryResult<
//   GetProfileQuery,
//   GetProfileQueryVariables
// >;
// export const ResetPasswordDocument = gql`
//   mutation ResetPassword($usernameOrEmail: String!) {
//     resetPassword(usernameOrEmail: $usernameOrEmail)
//   }
// `;
// export type ResetPasswordMutationFn = Apollo.MutationFunction<
//   ResetPasswordMutation,
//   ResetPasswordMutationVariables
// >;

// /**
//  * __useResetPasswordMutation__
//  *
//  * To run a mutation, you first call `useResetPasswordMutation` within a React component and pass it any options that fit your needs.
//  * When your component renders, `useResetPasswordMutation` returns a tuple that includes:
//  * - A mutate function that you can call at any time to execute the mutation
//  * - An object with fields that represent the current status of the mutation's execution
//  *
//  * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
//  *
//  * @example
//  * const [resetPasswordMutation, { data, loading, error }] = useResetPasswordMutation({
//  *   variables: {
//  *      usernameOrEmail: // value for 'usernameOrEmail'
//  *   },
//  * });
//  */
// export function useResetPasswordMutation(
//   baseOptions?: Apollo.MutationHookOptions<
//     ResetPasswordMutation,
//     ResetPasswordMutationVariables
//   >
// ) {
//   const options = { ...defaultOptions, ...baseOptions };
//   return Apollo.useMutation<
//     ResetPasswordMutation,
//     ResetPasswordMutationVariables
//   >(ResetPasswordDocument, options);
// }
// export type ResetPasswordMutationHookResult = ReturnType<
//   typeof useResetPasswordMutation
// >;
// export type ResetPasswordMutationResult =
//   Apollo.MutationResult<ResetPasswordMutation>;
// export type ResetPasswordMutationOptions = Apollo.BaseMutationOptions<
//   ResetPasswordMutation,
//   ResetPasswordMutationVariables
// >;
// export const ChangeEmailDocument = gql`
//   mutation ChangeEmail($email: String!) {
//     changeEmail(email: $email) {
//       ok
//     }
//   }
// `;
// export type ChangeEmailMutationFn = Apollo.MutationFunction<
//   ChangeEmailMutation,
//   ChangeEmailMutationVariables
// >;

// /**
//  * __useChangeEmailMutation__
//  *
//  * To run a mutation, you first call `useChangeEmailMutation` within a React component and pass it any options that fit your needs.
//  * When your component renders, `useChangeEmailMutation` returns a tuple that includes:
//  * - A mutate function that you can call at any time to execute the mutation
//  * - An object with fields that represent the current status of the mutation's execution
//  *
//  * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
//  *
//  * @example
//  * const [changeEmailMutation, { data, loading, error }] = useChangeEmailMutation({
//  *   variables: {
//  *      email: // value for 'email'
//  *   },
//  * });
//  */
// export function useChangeEmailMutation(
//   baseOptions?: Apollo.MutationHookOptions<
//     ChangeEmailMutation,
//     ChangeEmailMutationVariables
//   >
// ) {
//   const options = { ...defaultOptions, ...baseOptions };
//   return Apollo.useMutation<ChangeEmailMutation, ChangeEmailMutationVariables>(
//     ChangeEmailDocument,
//     options
//   );
// }
// export type ChangeEmailMutationHookResult = ReturnType<
//   typeof useChangeEmailMutation
// >;
// export type ChangeEmailMutationResult =
//   Apollo.MutationResult<ChangeEmailMutation>;
// export type ChangeEmailMutationOptions = Apollo.BaseMutationOptions<
//   ChangeEmailMutation,
//   ChangeEmailMutationVariables
// >;
// export const ChangeUsernameDocument = gql`
//   mutation ChangeUsername($username: String!) {
//     changeUsername(username: $username)
//   }
// `;
// export type ChangeUsernameMutationFn = Apollo.MutationFunction<
//   ChangeUsernameMutation,
//   ChangeUsernameMutationVariables
// >;

// /**
//  * __useChangeUsernameMutation__
//  *
//  * To run a mutation, you first call `useChangeUsernameMutation` within a React component and pass it any options that fit your needs.
//  * When your component renders, `useChangeUsernameMutation` returns a tuple that includes:
//  * - A mutate function that you can call at any time to execute the mutation
//  * - An object with fields that represent the current status of the mutation's execution
//  *
//  * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
//  *
//  * @example
//  * const [changeUsernameMutation, { data, loading, error }] = useChangeUsernameMutation({
//  *   variables: {
//  *      username: // value for 'username'
//  *   },
//  * });
//  */
// export function useChangeUsernameMutation(
//   baseOptions?: Apollo.MutationHookOptions<
//     ChangeUsernameMutation,
//     ChangeUsernameMutationVariables
//   >
// ) {
//   const options = { ...defaultOptions, ...baseOptions };
//   return Apollo.useMutation<
//     ChangeUsernameMutation,
//     ChangeUsernameMutationVariables
//   >(ChangeUsernameDocument, options);
// }
// export type ChangeUsernameMutationHookResult = ReturnType<
//   typeof useChangeUsernameMutation
// >;
// export type ChangeUsernameMutationResult =
//   Apollo.MutationResult<ChangeUsernameMutation>;
// export type ChangeUsernameMutationOptions = Apollo.BaseMutationOptions<
//   ChangeUsernameMutation,
//   ChangeUsernameMutationVariables
// >;
// export const GetNotificationSettingsDocument = gql`
//   query GetNotificationSettings {
//     getNotificationSettings {
//       newsletter
//     }
//   }
// `;

// /**
//  * __useGetNotificationSettingsQuery__
//  *
//  * To run a query within a React component, call `useGetNotificationSettingsQuery` and pass it any options that fit your needs.
//  * When your component renders, `useGetNotificationSettingsQuery` returns an object from Apollo Client that contains loading, error, and data properties
//  * you can use to render your UI.
//  *
//  * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
//  *
//  * @example
//  * const { data, loading, error } = useGetNotificationSettingsQuery({
//  *   variables: {
//  *   },
//  * });
//  */
// export function useGetNotificationSettingsQuery(
//   baseOptions?: Apollo.QueryHookOptions<
//     GetNotificationSettingsQuery,
//     GetNotificationSettingsQueryVariables
//   >
// ) {
//   const options = { ...defaultOptions, ...baseOptions };
//   return Apollo.useQuery<
//     GetNotificationSettingsQuery,
//     GetNotificationSettingsQueryVariables
//   >(GetNotificationSettingsDocument, options);
// }
// export function useGetNotificationSettingsLazyQuery(
//   baseOptions?: Apollo.LazyQueryHookOptions<
//     GetNotificationSettingsQuery,
//     GetNotificationSettingsQueryVariables
//   >
// ) {
//   const options = { ...defaultOptions, ...baseOptions };
//   return Apollo.useLazyQuery<
//     GetNotificationSettingsQuery,
//     GetNotificationSettingsQueryVariables
//   >(GetNotificationSettingsDocument, options);
// }
// export type GetNotificationSettingsQueryHookResult = ReturnType<
//   typeof useGetNotificationSettingsQuery
// >;
// export type GetNotificationSettingsLazyQueryHookResult = ReturnType<
//   typeof useGetNotificationSettingsLazyQuery
// >;
// export type GetNotificationSettingsQueryResult = Apollo.QueryResult<
//   GetNotificationSettingsQuery,
//   GetNotificationSettingsQueryVariables
// >;
// export const UpdateNotificationSettingsDocument = gql`
//   mutation UpdateNotificationSettings($values: NotificationSettingsInput!) {
//     updateNotificationSettings(values: $values) {
//       newsletter
//     }
//   }
// `;
// export type UpdateNotificationSettingsMutationFn = Apollo.MutationFunction<
//   UpdateNotificationSettingsMutation,
//   UpdateNotificationSettingsMutationVariables
// >;

// /**
//  * __useUpdateNotificationSettingsMutation__
//  *
//  * To run a mutation, you first call `useUpdateNotificationSettingsMutation` within a React component and pass it any options that fit your needs.
//  * When your component renders, `useUpdateNotificationSettingsMutation` returns a tuple that includes:
//  * - A mutate function that you can call at any time to execute the mutation
//  * - An object with fields that represent the current status of the mutation's execution
//  *
//  * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
//  *
//  * @example
//  * const [updateNotificationSettingsMutation, { data, loading, error }] = useUpdateNotificationSettingsMutation({
//  *   variables: {
//  *      values: // value for 'values'
//  *   },
//  * });
//  */
// export function useUpdateNotificationSettingsMutation(
//   baseOptions?: Apollo.MutationHookOptions<
//     UpdateNotificationSettingsMutation,
//     UpdateNotificationSettingsMutationVariables
//   >
// ) {
//   const options = { ...defaultOptions, ...baseOptions };
//   return Apollo.useMutation<
//     UpdateNotificationSettingsMutation,
//     UpdateNotificationSettingsMutationVariables
//   >(UpdateNotificationSettingsDocument, options);
// }
// export type UpdateNotificationSettingsMutationHookResult = ReturnType<
//   typeof useUpdateNotificationSettingsMutation
// >;
// export type UpdateNotificationSettingsMutationResult =
//   Apollo.MutationResult<UpdateNotificationSettingsMutation>;
// export type UpdateNotificationSettingsMutationOptions =
//   Apollo.BaseMutationOptions<
//     UpdateNotificationSettingsMutation,
//     UpdateNotificationSettingsMutationVariables
//   >;
// export const ChangePasswordDocument = gql`
//   mutation ChangePassword($password: String!) {
//     changePassword(password: $password)
//   }
// `;
// export type ChangePasswordMutationFn = Apollo.MutationFunction<
//   ChangePasswordMutation,
//   ChangePasswordMutationVariables
// >;

// /**
//  * __useChangePasswordMutation__
//  *
//  * To run a mutation, you first call `useChangePasswordMutation` within a React component and pass it any options that fit your needs.
//  * When your component renders, `useChangePasswordMutation` returns a tuple that includes:
//  * - A mutate function that you can call at any time to execute the mutation
//  * - An object with fields that represent the current status of the mutation's execution
//  *
//  * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
//  *
//  * @example
//  * const [changePasswordMutation, { data, loading, error }] = useChangePasswordMutation({
//  *   variables: {
//  *      password: // value for 'password'
//  *   },
//  * });
//  */
// export function useChangePasswordMutation(
//   baseOptions?: Apollo.MutationHookOptions<
//     ChangePasswordMutation,
//     ChangePasswordMutationVariables
//   >
// ) {
//   const options = { ...defaultOptions, ...baseOptions };
//   return Apollo.useMutation<
//     ChangePasswordMutation,
//     ChangePasswordMutationVariables
//   >(ChangePasswordDocument, options);
// }
// export type ChangePasswordMutationHookResult = ReturnType<
//   typeof useChangePasswordMutation
// >;
// export type ChangePasswordMutationResult =
//   Apollo.MutationResult<ChangePasswordMutation>;
// export type ChangePasswordMutationOptions = Apollo.BaseMutationOptions<
//   ChangePasswordMutation,
//   ChangePasswordMutationVariables
// >;
// export const GetMyProfileDocument = gql`
//   query GetMyProfile {
//     getMyProfile {
//       name
//       about
//       country
//       url
//     }
//   }
// `;

// /**
//  * __useGetMyProfileQuery__
//  *
//  * To run a query within a React component, call `useGetMyProfileQuery` and pass it any options that fit your needs.
//  * When your component renders, `useGetMyProfileQuery` returns an object from Apollo Client that contains loading, error, and data properties
//  * you can use to render your UI.
//  *
//  * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
//  *
//  * @example
//  * const { data, loading, error } = useGetMyProfileQuery({
//  *   variables: {
//  *   },
//  * });
//  */
// export function useGetMyProfileQuery(
//   baseOptions?: Apollo.QueryHookOptions<
//     GetMyProfileQuery,
//     GetMyProfileQueryVariables
//   >
// ) {
//   const options = { ...defaultOptions, ...baseOptions };
//   return Apollo.useQuery<GetMyProfileQuery, GetMyProfileQueryVariables>(
//     GetMyProfileDocument,
//     options
//   );
// }
// export function useGetMyProfileLazyQuery(
//   baseOptions?: Apollo.LazyQueryHookOptions<
//     GetMyProfileQuery,
//     GetMyProfileQueryVariables
//   >
// ) {
//   const options = { ...defaultOptions, ...baseOptions };
//   return Apollo.useLazyQuery<GetMyProfileQuery, GetMyProfileQueryVariables>(
//     GetMyProfileDocument,
//     options
//   );
// }
// export type GetMyProfileQueryHookResult = ReturnType<
//   typeof useGetMyProfileQuery
// >;
// export type GetMyProfileLazyQueryHookResult = ReturnType<
//   typeof useGetMyProfileLazyQuery
// >;
// export type GetMyProfileQueryResult = Apollo.QueryResult<
//   GetMyProfileQuery,
//   GetMyProfileQueryVariables
// >;
// export const UpdateMyProfileDocument = gql`
//   mutation UpdateMyProfile($values: UpdateProfileInput!) {
//     updateMyProfile(values: $values) {
//       name
//       about
//       country
//       url
//     }
//   }
// `;
// export type UpdateMyProfileMutationFn = Apollo.MutationFunction<
//   UpdateMyProfileMutation,
//   UpdateMyProfileMutationVariables
// >;

// /**
//  * __useUpdateMyProfileMutation__
//  *
//  * To run a mutation, you first call `useUpdateMyProfileMutation` within a React component and pass it any options that fit your needs.
//  * When your component renders, `useUpdateMyProfileMutation` returns a tuple that includes:
//  * - A mutate function that you can call at any time to execute the mutation
//  * - An object with fields that represent the current status of the mutation's execution
//  *
//  * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
//  *
//  * @example
//  * const [updateMyProfileMutation, { data, loading, error }] = useUpdateMyProfileMutation({
//  *   variables: {
//  *      values: // value for 'values'
//  *   },
//  * });
//  */
// export function useUpdateMyProfileMutation(
//   baseOptions?: Apollo.MutationHookOptions<
//     UpdateMyProfileMutation,
//     UpdateMyProfileMutationVariables
//   >
// ) {
//   const options = { ...defaultOptions, ...baseOptions };
//   return Apollo.useMutation<
//     UpdateMyProfileMutation,
//     UpdateMyProfileMutationVariables
//   >(UpdateMyProfileDocument, options);
// }
// export type UpdateMyProfileMutationHookResult = ReturnType<
//   typeof useUpdateMyProfileMutation
// >;
// export type UpdateMyProfileMutationResult =
//   Apollo.MutationResult<UpdateMyProfileMutation>;
// export type UpdateMyProfileMutationOptions = Apollo.BaseMutationOptions<
//   UpdateMyProfileMutation,
//   UpdateMyProfileMutationVariables
// >;
// export const GetAvatarUploadUrlDocument = gql`
//   query GetAvatarUploadUrl {
//     getAvatarUploadUrl {
//       url
//       fields {
//         name
//         value
//       }
//     }
//   }
// `;

// /**
//  * __useGetAvatarUploadUrlQuery__
//  *
//  * To run a query within a React component, call `useGetAvatarUploadUrlQuery` and pass it any options that fit your needs.
//  * When your component renders, `useGetAvatarUploadUrlQuery` returns an object from Apollo Client that contains loading, error, and data properties
//  * you can use to render your UI.
//  *
//  * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
//  *
//  * @example
//  * const { data, loading, error } = useGetAvatarUploadUrlQuery({
//  *   variables: {
//  *   },
//  * });
//  */
// export function useGetAvatarUploadUrlQuery(
//   baseOptions?: Apollo.QueryHookOptions<
//     GetAvatarUploadUrlQuery,
//     GetAvatarUploadUrlQueryVariables
//   >
// ) {
//   const options = { ...defaultOptions, ...baseOptions };
//   return Apollo.useQuery<
//     GetAvatarUploadUrlQuery,
//     GetAvatarUploadUrlQueryVariables
//   >(GetAvatarUploadUrlDocument, options);
// }
// export function useGetAvatarUploadUrlLazyQuery(
//   baseOptions?: Apollo.LazyQueryHookOptions<
//     GetAvatarUploadUrlQuery,
//     GetAvatarUploadUrlQueryVariables
//   >
// ) {
//   const options = { ...defaultOptions, ...baseOptions };
//   return Apollo.useLazyQuery<
//     GetAvatarUploadUrlQuery,
//     GetAvatarUploadUrlQueryVariables
//   >(GetAvatarUploadUrlDocument, options);
// }
// export type GetAvatarUploadUrlQueryHookResult = ReturnType<
//   typeof useGetAvatarUploadUrlQuery
// >;
// export type GetAvatarUploadUrlLazyQueryHookResult = ReturnType<
//   typeof useGetAvatarUploadUrlLazyQuery
// >;
// export type GetAvatarUploadUrlQueryResult = Apollo.QueryResult<
//   GetAvatarUploadUrlQuery,
//   GetAvatarUploadUrlQueryVariables
// >;
// export const CompleteAvatarUploadDocument = gql`
//   mutation CompleteAvatarUpload {
//     completeAvatarUpload {
//       avatarId
//     }
//   }
// `;
// export type CompleteAvatarUploadMutationFn = Apollo.MutationFunction<
//   CompleteAvatarUploadMutation,
//   CompleteAvatarUploadMutationVariables
// >;

// /**
//  * __useCompleteAvatarUploadMutation__
//  *
//  * To run a mutation, you first call `useCompleteAvatarUploadMutation` within a React component and pass it any options that fit your needs.
//  * When your component renders, `useCompleteAvatarUploadMutation` returns a tuple that includes:
//  * - A mutate function that you can call at any time to execute the mutation
//  * - An object with fields that represent the current status of the mutation's execution
//  *
//  * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
//  *
//  * @example
//  * const [completeAvatarUploadMutation, { data, loading, error }] = useCompleteAvatarUploadMutation({
//  *   variables: {
//  *   },
//  * });
//  */
// export function useCompleteAvatarUploadMutation(
//   baseOptions?: Apollo.MutationHookOptions<
//     CompleteAvatarUploadMutation,
//     CompleteAvatarUploadMutationVariables
//   >
// ) {
//   const options = { ...defaultOptions, ...baseOptions };
//   return Apollo.useMutation<
//     CompleteAvatarUploadMutation,
//     CompleteAvatarUploadMutationVariables
//   >(CompleteAvatarUploadDocument, options);
// }
// export type CompleteAvatarUploadMutationHookResult = ReturnType<
//   typeof useCompleteAvatarUploadMutation
// >;
// export type CompleteAvatarUploadMutationResult =
//   Apollo.MutationResult<CompleteAvatarUploadMutation>;
// export type CompleteAvatarUploadMutationOptions = Apollo.BaseMutationOptions<
//   CompleteAvatarUploadMutation,
//   CompleteAvatarUploadMutationVariables
// >;
// export const DeleteAvatarDocument = gql`
//   mutation DeleteAvatar {
//     deleteAvatar
//   }
// `;
// export type DeleteAvatarMutationFn = Apollo.MutationFunction<
//   DeleteAvatarMutation,
//   DeleteAvatarMutationVariables
// >;

// /**
//  * __useDeleteAvatarMutation__
//  *
//  * To run a mutation, you first call `useDeleteAvatarMutation` within a React component and pass it any options that fit your needs.
//  * When your component renders, `useDeleteAvatarMutation` returns a tuple that includes:
//  * - A mutate function that you can call at any time to execute the mutation
//  * - An object with fields that represent the current status of the mutation's execution
//  *
//  * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
//  *
//  * @example
//  * const [deleteAvatarMutation, { data, loading, error }] = useDeleteAvatarMutation({
//  *   variables: {
//  *   },
//  * });
//  */
// export function useDeleteAvatarMutation(
//   baseOptions?: Apollo.MutationHookOptions<
//     DeleteAvatarMutation,
//     DeleteAvatarMutationVariables
//   >
// ) {
//   const options = { ...defaultOptions, ...baseOptions };
//   return Apollo.useMutation<
//     DeleteAvatarMutation,
//     DeleteAvatarMutationVariables
//   >(DeleteAvatarDocument, options);
// }
// export type DeleteAvatarMutationHookResult = ReturnType<
//   typeof useDeleteAvatarMutation
// >;
// export type DeleteAvatarMutationResult =
//   Apollo.MutationResult<DeleteAvatarMutation>;
// export type DeleteAvatarMutationOptions = Apollo.BaseMutationOptions<
//   DeleteAvatarMutation,
//   DeleteAvatarMutationVariables
// >;
// export const RegisterDocument = gql`
//   mutation Register($registerValues: RegisterInput!) {
//     register(values: $registerValues) {
//       ...DefaultAuthResult
//     }
//   }
//   ${DefaultAuthResultFragmentDoc}
// `;
// export type RegisterMutationFn = Apollo.MutationFunction<
//   RegisterMutation,
//   RegisterMutationVariables
// >;

// /**
//  * __useRegisterMutation__
//  *
//  * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
//  * When your component renders, `useRegisterMutation` returns a tuple that includes:
//  * - A mutate function that you can call at any time to execute the mutation
//  * - An object with fields that represent the current status of the mutation's execution
//  *
//  * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
//  *
//  * @example
//  * const [registerMutation, { data, loading, error }] = useRegisterMutation({
//  *   variables: {
//  *      registerValues: // value for 'registerValues'
//  *   },
//  * });
//  */
// export function useRegisterMutation(
//   baseOptions?: Apollo.MutationHookOptions<
//     RegisterMutation,
//     RegisterMutationVariables
//   >
// ) {
//   const options = { ...defaultOptions, ...baseOptions };
//   return Apollo.useMutation<RegisterMutation, RegisterMutationVariables>(
//     RegisterDocument,
//     options
//   );
// }
// export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
// export type RegisterMutationResult = Apollo.MutationResult<RegisterMutation>;
// export type RegisterMutationOptions = Apollo.BaseMutationOptions<
//   RegisterMutation,
//   RegisterMutationVariables
// >;
// export const AppDataDocument = gql`
//   query AppData {
//     me {
//       id
//       username
//       email
//       isAdmin
//       isVerified
//       avatarId
//     }
//   }
// `;

// /**
//  * __useAppDataQuery__
//  *
//  * To run a query within a React component, call `useAppDataQuery` and pass it any options that fit your needs.
//  * When your component renders, `useAppDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
//  * you can use to render your UI.
//  *
//  * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
//  *
//  * @example
//  * const { data, loading, error } = useAppDataQuery({
//  *   variables: {
//  *   },
//  * });
//  */
// export function useAppDataQuery(
//   baseOptions?: Apollo.QueryHookOptions<AppDataQuery, AppDataQueryVariables>
// ) {
//   const options = { ...defaultOptions, ...baseOptions };
//   return Apollo.useQuery<AppDataQuery, AppDataQueryVariables>(
//     AppDataDocument,
//     options
//   );
// }
// export function useAppDataLazyQuery(
//   baseOptions?: Apollo.LazyQueryHookOptions<AppDataQuery, AppDataQueryVariables>
// ) {
//   const options = { ...defaultOptions, ...baseOptions };
//   return Apollo.useLazyQuery<AppDataQuery, AppDataQueryVariables>(
//     AppDataDocument,
//     options
//   );
// }
// export type AppDataQueryHookResult = ReturnType<typeof useAppDataQuery>;
// export type AppDataLazyQueryHookResult = ReturnType<typeof useAppDataLazyQuery>;
// export type AppDataQueryResult = Apollo.QueryResult<
//   AppDataQuery,
//   AppDataQueryVariables
// >;
