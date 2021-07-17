import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {};
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

export type Query = {
  __typename?: 'Query';
  me: User;
  ping: Scalars['Float'];
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

export type User = {
  __typename?: 'User';
  id: Scalars['String'];
  username: Scalars['String'];
  email: Scalars['String'];
  isAdmin?: Maybe<Scalars['Boolean']>;
  isVerified: Scalars['Boolean'];
};

export type LoginGithubMutationVariables = Exact<{
  code: Scalars['String'];
}>;

export type LoginGithubMutation = { __typename?: 'Mutation' } & {
  loginGithub: { __typename?: 'AuthResult' } & DefaultAuthResultFragment;
};

export type RegisterGithubMutationVariables = Exact<{
  code: Scalars['String'];
}>;

export type RegisterGithubMutation = { __typename?: 'Mutation' } & {
  registerGithub: { __typename?: 'AuthResult' } & DefaultAuthResultFragment;
};

export type LoginGoogleMutationVariables = Exact<{
  accessToken: Scalars['String'];
}>;

export type LoginGoogleMutation = { __typename?: 'Mutation' } & {
  loginGoogle: { __typename?: 'AuthResult' } & DefaultAuthResultFragment;
};

export type RegisterGoogleMutationVariables = Exact<{
  accessToken: Scalars['String'];
}>;

export type RegisterGoogleMutation = { __typename?: 'Mutation' } & {
  registerGoogle: { __typename?: 'AuthResult' } & DefaultAuthResultFragment;
};

export type LogoutMutationVariables = Exact<{ [key: string]: never }>;

export type LogoutMutation = { __typename?: 'Mutation' } & Pick<
  Mutation,
  'logout'
>;

export type GetChallengeQueryVariables = Exact<{ [key: string]: never }>;

export type GetChallengeQuery = { __typename?: 'Query' } & {
  me: { __typename?: 'User' } & Pick<User, 'id'>;
};

export type ConfirmResetPasswordMutationVariables = Exact<{
  code: Scalars['String'];
  newPassword: Scalars['String'];
}>;

export type ConfirmResetPasswordMutation = { __typename?: 'Mutation' } & {
  confirmResetPassword: {
    __typename?: 'AuthResult';
  } & DefaultAuthResultFragment;
};

export type LoginMutationVariables = Exact<{
  loginValues: LoginInput;
}>;

export type LoginMutation = { __typename?: 'Mutation' } & {
  login: { __typename?: 'AuthResult' } & DefaultAuthResultFragment;
};

export type GetModuleQueryVariables = Exact<{ [key: string]: never }>;

export type GetModuleQuery = { __typename?: 'Query' } & {
  me: { __typename?: 'User' } & Pick<User, 'id'>;
};

export type GetModulesQueryVariables = Exact<{ [key: string]: never }>;

export type GetModulesQuery = { __typename?: 'Query' } & {
  me: { __typename?: 'User' } & Pick<User, 'id'>;
};

export type GetProfileQueryVariables = Exact<{ [key: string]: never }>;

export type GetProfileQuery = { __typename?: 'Query' } & {
  me: { __typename?: 'User' } & Pick<User, 'id'>;
};

export type ResetPasswordMutationVariables = Exact<{
  usernameOrEmail: Scalars['String'];
}>;

export type ResetPasswordMutation = { __typename?: 'Mutation' } & Pick<
  Mutation,
  'resetPassword'
>;

export type GetSettingsQueryVariables = Exact<{ [key: string]: never }>;

export type GetSettingsQuery = { __typename?: 'Query' } & {
  me: { __typename?: 'User' } & Pick<User, 'id'>;
};

export type RegisterMutationVariables = Exact<{
  registerValues: RegisterInput;
}>;

export type RegisterMutation = { __typename?: 'Mutation' } & {
  register: { __typename?: 'AuthResult' } & DefaultAuthResultFragment;
};

export type DefaultAuthResultFragment = { __typename?: 'AuthResult' } & Pick<
  AuthResult,
  'token'
> & { user: { __typename?: 'User' } & AllUserPropsFragment };

export type AppDataQueryVariables = Exact<{ [key: string]: never }>;

export type AppDataQuery = { __typename?: 'Query' } & {
  me: { __typename?: 'User' } & AllUserPropsFragment;
};

export type AllUserPropsFragment = { __typename?: 'User' } & Pick<
  User,
  'id' | 'username' | 'email' | 'isAdmin' | 'isVerified'
>;

export const AllUserPropsFragmentDoc = gql`
  fragment allUserProps on User {
    id
    username
    email
    isAdmin
    isVerified
  }
`;
export const DefaultAuthResultFragmentDoc = gql`
  fragment DefaultAuthResult on AuthResult {
    token
    user {
      ...allUserProps
    }
  }
  ${AllUserPropsFragmentDoc}
`;
export const LoginGithubDocument = gql`
  mutation LoginGithub($code: String!) {
    loginGithub(code: $code) {
      ...DefaultAuthResult
    }
  }
  ${DefaultAuthResultFragmentDoc}
`;
export type LoginGithubMutationFn = Apollo.MutationFunction<
  LoginGithubMutation,
  LoginGithubMutationVariables
>;

/**
 * __useLoginGithubMutation__
 *
 * To run a mutation, you first call `useLoginGithubMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginGithubMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginGithubMutation, { data, loading, error }] = useLoginGithubMutation({
 *   variables: {
 *      code: // value for 'code'
 *   },
 * });
 */
export function useLoginGithubMutation(
  baseOptions?: Apollo.MutationHookOptions<
    LoginGithubMutation,
    LoginGithubMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<LoginGithubMutation, LoginGithubMutationVariables>(
    LoginGithubDocument,
    options
  );
}
export type LoginGithubMutationHookResult = ReturnType<
  typeof useLoginGithubMutation
>;
export type LoginGithubMutationResult =
  Apollo.MutationResult<LoginGithubMutation>;
export type LoginGithubMutationOptions = Apollo.BaseMutationOptions<
  LoginGithubMutation,
  LoginGithubMutationVariables
>;
export const RegisterGithubDocument = gql`
  mutation RegisterGithub($code: String!) {
    registerGithub(code: $code) {
      ...DefaultAuthResult
    }
  }
  ${DefaultAuthResultFragmentDoc}
`;
export type RegisterGithubMutationFn = Apollo.MutationFunction<
  RegisterGithubMutation,
  RegisterGithubMutationVariables
>;

/**
 * __useRegisterGithubMutation__
 *
 * To run a mutation, you first call `useRegisterGithubMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterGithubMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerGithubMutation, { data, loading, error }] = useRegisterGithubMutation({
 *   variables: {
 *      code: // value for 'code'
 *   },
 * });
 */
export function useRegisterGithubMutation(
  baseOptions?: Apollo.MutationHookOptions<
    RegisterGithubMutation,
    RegisterGithubMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    RegisterGithubMutation,
    RegisterGithubMutationVariables
  >(RegisterGithubDocument, options);
}
export type RegisterGithubMutationHookResult = ReturnType<
  typeof useRegisterGithubMutation
>;
export type RegisterGithubMutationResult =
  Apollo.MutationResult<RegisterGithubMutation>;
export type RegisterGithubMutationOptions = Apollo.BaseMutationOptions<
  RegisterGithubMutation,
  RegisterGithubMutationVariables
>;
export const LoginGoogleDocument = gql`
  mutation LoginGoogle($accessToken: String!) {
    loginGoogle(accessToken: $accessToken) {
      ...DefaultAuthResult
    }
  }
  ${DefaultAuthResultFragmentDoc}
`;
export type LoginGoogleMutationFn = Apollo.MutationFunction<
  LoginGoogleMutation,
  LoginGoogleMutationVariables
>;

/**
 * __useLoginGoogleMutation__
 *
 * To run a mutation, you first call `useLoginGoogleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginGoogleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginGoogleMutation, { data, loading, error }] = useLoginGoogleMutation({
 *   variables: {
 *      accessToken: // value for 'accessToken'
 *   },
 * });
 */
export function useLoginGoogleMutation(
  baseOptions?: Apollo.MutationHookOptions<
    LoginGoogleMutation,
    LoginGoogleMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<LoginGoogleMutation, LoginGoogleMutationVariables>(
    LoginGoogleDocument,
    options
  );
}
export type LoginGoogleMutationHookResult = ReturnType<
  typeof useLoginGoogleMutation
>;
export type LoginGoogleMutationResult =
  Apollo.MutationResult<LoginGoogleMutation>;
export type LoginGoogleMutationOptions = Apollo.BaseMutationOptions<
  LoginGoogleMutation,
  LoginGoogleMutationVariables
>;
export const RegisterGoogleDocument = gql`
  mutation RegisterGoogle($accessToken: String!) {
    registerGoogle(accessToken: $accessToken) {
      ...DefaultAuthResult
    }
  }
  ${DefaultAuthResultFragmentDoc}
`;
export type RegisterGoogleMutationFn = Apollo.MutationFunction<
  RegisterGoogleMutation,
  RegisterGoogleMutationVariables
>;

/**
 * __useRegisterGoogleMutation__
 *
 * To run a mutation, you first call `useRegisterGoogleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterGoogleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerGoogleMutation, { data, loading, error }] = useRegisterGoogleMutation({
 *   variables: {
 *      accessToken: // value for 'accessToken'
 *   },
 * });
 */
export function useRegisterGoogleMutation(
  baseOptions?: Apollo.MutationHookOptions<
    RegisterGoogleMutation,
    RegisterGoogleMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    RegisterGoogleMutation,
    RegisterGoogleMutationVariables
  >(RegisterGoogleDocument, options);
}
export type RegisterGoogleMutationHookResult = ReturnType<
  typeof useRegisterGoogleMutation
>;
export type RegisterGoogleMutationResult =
  Apollo.MutationResult<RegisterGoogleMutation>;
export type RegisterGoogleMutationOptions = Apollo.BaseMutationOptions<
  RegisterGoogleMutation,
  RegisterGoogleMutationVariables
>;
export const LogoutDocument = gql`
  mutation Logout {
    logout
  }
`;
export type LogoutMutationFn = Apollo.MutationFunction<
  LogoutMutation,
  LogoutMutationVariables
>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(
  baseOptions?: Apollo.MutationHookOptions<
    LogoutMutation,
    LogoutMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<LogoutMutation, LogoutMutationVariables>(
    LogoutDocument,
    options
  );
}
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = Apollo.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = Apollo.BaseMutationOptions<
  LogoutMutation,
  LogoutMutationVariables
>;
export const GetChallengeDocument = gql`
  query GetChallenge {
    me {
      id
    }
  }
`;

/**
 * __useGetChallengeQuery__
 *
 * To run a query within a React component, call `useGetChallengeQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetChallengeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetChallengeQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetChallengeQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetChallengeQuery,
    GetChallengeQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetChallengeQuery, GetChallengeQueryVariables>(
    GetChallengeDocument,
    options
  );
}
export function useGetChallengeLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetChallengeQuery,
    GetChallengeQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetChallengeQuery, GetChallengeQueryVariables>(
    GetChallengeDocument,
    options
  );
}
export type GetChallengeQueryHookResult = ReturnType<
  typeof useGetChallengeQuery
>;
export type GetChallengeLazyQueryHookResult = ReturnType<
  typeof useGetChallengeLazyQuery
>;
export type GetChallengeQueryResult = Apollo.QueryResult<
  GetChallengeQuery,
  GetChallengeQueryVariables
>;
export const ConfirmResetPasswordDocument = gql`
  mutation ConfirmResetPassword($code: String!, $newPassword: String!) {
    confirmResetPassword(code: $code, newPassword: $newPassword) {
      ...DefaultAuthResult
    }
  }
  ${DefaultAuthResultFragmentDoc}
`;
export type ConfirmResetPasswordMutationFn = Apollo.MutationFunction<
  ConfirmResetPasswordMutation,
  ConfirmResetPasswordMutationVariables
>;

/**
 * __useConfirmResetPasswordMutation__
 *
 * To run a mutation, you first call `useConfirmResetPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useConfirmResetPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [confirmResetPasswordMutation, { data, loading, error }] = useConfirmResetPasswordMutation({
 *   variables: {
 *      code: // value for 'code'
 *      newPassword: // value for 'newPassword'
 *   },
 * });
 */
export function useConfirmResetPasswordMutation(
  baseOptions?: Apollo.MutationHookOptions<
    ConfirmResetPasswordMutation,
    ConfirmResetPasswordMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    ConfirmResetPasswordMutation,
    ConfirmResetPasswordMutationVariables
  >(ConfirmResetPasswordDocument, options);
}
export type ConfirmResetPasswordMutationHookResult = ReturnType<
  typeof useConfirmResetPasswordMutation
>;
export type ConfirmResetPasswordMutationResult =
  Apollo.MutationResult<ConfirmResetPasswordMutation>;
export type ConfirmResetPasswordMutationOptions = Apollo.BaseMutationOptions<
  ConfirmResetPasswordMutation,
  ConfirmResetPasswordMutationVariables
>;
export const LoginDocument = gql`
  mutation Login($loginValues: LoginInput!) {
    login(values: $loginValues) {
      ...DefaultAuthResult
    }
  }
  ${DefaultAuthResultFragmentDoc}
`;
export type LoginMutationFn = Apollo.MutationFunction<
  LoginMutation,
  LoginMutationVariables
>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      loginValues: // value for 'loginValues'
 *   },
 * });
 */
export function useLoginMutation(
  baseOptions?: Apollo.MutationHookOptions<
    LoginMutation,
    LoginMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<LoginMutation, LoginMutationVariables>(
    LoginDocument,
    options
  );
}
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<
  LoginMutation,
  LoginMutationVariables
>;
export const GetModuleDocument = gql`
  query GetModule {
    me {
      id
    }
  }
`;

/**
 * __useGetModuleQuery__
 *
 * To run a query within a React component, call `useGetModuleQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetModuleQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetModuleQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetModuleQuery(
  baseOptions?: Apollo.QueryHookOptions<GetModuleQuery, GetModuleQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetModuleQuery, GetModuleQueryVariables>(
    GetModuleDocument,
    options
  );
}
export function useGetModuleLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetModuleQuery,
    GetModuleQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetModuleQuery, GetModuleQueryVariables>(
    GetModuleDocument,
    options
  );
}
export type GetModuleQueryHookResult = ReturnType<typeof useGetModuleQuery>;
export type GetModuleLazyQueryHookResult = ReturnType<
  typeof useGetModuleLazyQuery
>;
export type GetModuleQueryResult = Apollo.QueryResult<
  GetModuleQuery,
  GetModuleQueryVariables
>;
export const GetModulesDocument = gql`
  query GetModules {
    me {
      id
    }
  }
`;

/**
 * __useGetModulesQuery__
 *
 * To run a query within a React component, call `useGetModulesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetModulesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetModulesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetModulesQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetModulesQuery,
    GetModulesQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetModulesQuery, GetModulesQueryVariables>(
    GetModulesDocument,
    options
  );
}
export function useGetModulesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetModulesQuery,
    GetModulesQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetModulesQuery, GetModulesQueryVariables>(
    GetModulesDocument,
    options
  );
}
export type GetModulesQueryHookResult = ReturnType<typeof useGetModulesQuery>;
export type GetModulesLazyQueryHookResult = ReturnType<
  typeof useGetModulesLazyQuery
>;
export type GetModulesQueryResult = Apollo.QueryResult<
  GetModulesQuery,
  GetModulesQueryVariables
>;
export const GetProfileDocument = gql`
  query GetProfile {
    me {
      id
    }
  }
`;

/**
 * __useGetProfileQuery__
 *
 * To run a query within a React component, call `useGetProfileQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProfileQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProfileQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetProfileQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetProfileQuery,
    GetProfileQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetProfileQuery, GetProfileQueryVariables>(
    GetProfileDocument,
    options
  );
}
export function useGetProfileLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetProfileQuery,
    GetProfileQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetProfileQuery, GetProfileQueryVariables>(
    GetProfileDocument,
    options
  );
}
export type GetProfileQueryHookResult = ReturnType<typeof useGetProfileQuery>;
export type GetProfileLazyQueryHookResult = ReturnType<
  typeof useGetProfileLazyQuery
>;
export type GetProfileQueryResult = Apollo.QueryResult<
  GetProfileQuery,
  GetProfileQueryVariables
>;
export const ResetPasswordDocument = gql`
  mutation ResetPassword($usernameOrEmail: String!) {
    resetPassword(usernameOrEmail: $usernameOrEmail)
  }
`;
export type ResetPasswordMutationFn = Apollo.MutationFunction<
  ResetPasswordMutation,
  ResetPasswordMutationVariables
>;

/**
 * __useResetPasswordMutation__
 *
 * To run a mutation, you first call `useResetPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useResetPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [resetPasswordMutation, { data, loading, error }] = useResetPasswordMutation({
 *   variables: {
 *      usernameOrEmail: // value for 'usernameOrEmail'
 *   },
 * });
 */
export function useResetPasswordMutation(
  baseOptions?: Apollo.MutationHookOptions<
    ResetPasswordMutation,
    ResetPasswordMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    ResetPasswordMutation,
    ResetPasswordMutationVariables
  >(ResetPasswordDocument, options);
}
export type ResetPasswordMutationHookResult = ReturnType<
  typeof useResetPasswordMutation
>;
export type ResetPasswordMutationResult =
  Apollo.MutationResult<ResetPasswordMutation>;
export type ResetPasswordMutationOptions = Apollo.BaseMutationOptions<
  ResetPasswordMutation,
  ResetPasswordMutationVariables
>;
export const GetSettingsDocument = gql`
  query GetSettings {
    me {
      id
    }
  }
`;

/**
 * __useGetSettingsQuery__
 *
 * To run a query within a React component, call `useGetSettingsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSettingsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSettingsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetSettingsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetSettingsQuery,
    GetSettingsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetSettingsQuery, GetSettingsQueryVariables>(
    GetSettingsDocument,
    options
  );
}
export function useGetSettingsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetSettingsQuery,
    GetSettingsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetSettingsQuery, GetSettingsQueryVariables>(
    GetSettingsDocument,
    options
  );
}
export type GetSettingsQueryHookResult = ReturnType<typeof useGetSettingsQuery>;
export type GetSettingsLazyQueryHookResult = ReturnType<
  typeof useGetSettingsLazyQuery
>;
export type GetSettingsQueryResult = Apollo.QueryResult<
  GetSettingsQuery,
  GetSettingsQueryVariables
>;
export const RegisterDocument = gql`
  mutation Register($registerValues: RegisterInput!) {
    register(values: $registerValues) {
      ...DefaultAuthResult
    }
  }
  ${DefaultAuthResultFragmentDoc}
`;
export type RegisterMutationFn = Apollo.MutationFunction<
  RegisterMutation,
  RegisterMutationVariables
>;

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      registerValues: // value for 'registerValues'
 *   },
 * });
 */
export function useRegisterMutation(
  baseOptions?: Apollo.MutationHookOptions<
    RegisterMutation,
    RegisterMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<RegisterMutation, RegisterMutationVariables>(
    RegisterDocument,
    options
  );
}
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = Apollo.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = Apollo.BaseMutationOptions<
  RegisterMutation,
  RegisterMutationVariables
>;
export const AppDataDocument = gql`
  query AppData {
    me {
      ...allUserProps
    }
  }
  ${AllUserPropsFragmentDoc}
`;

/**
 * __useAppDataQuery__
 *
 * To run a query within a React component, call `useAppDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useAppDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAppDataQuery({
 *   variables: {
 *   },
 * });
 */
export function useAppDataQuery(
  baseOptions?: Apollo.QueryHookOptions<AppDataQuery, AppDataQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<AppDataQuery, AppDataQueryVariables>(
    AppDataDocument,
    options
  );
}
export function useAppDataLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<AppDataQuery, AppDataQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<AppDataQuery, AppDataQueryVariables>(
    AppDataDocument,
    options
  );
}
export type AppDataQueryHookResult = ReturnType<typeof useAppDataQuery>;
export type AppDataLazyQueryHookResult = ReturnType<typeof useAppDataLazyQuery>;
export type AppDataQueryResult = Apollo.QueryResult<
  AppDataQuery,
  AppDataQueryVariables
>;
