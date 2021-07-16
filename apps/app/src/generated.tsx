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
  forgotPassword?: Maybe<Scalars['Void']>;
  resetPassword: AuthResult;
};

export type MutationLoginArgs = {
  values: LoginInput;
};

export type MutationRegisterArgs = {
  values: RegisterInput;
};

export type MutationForgotPasswordArgs = {
  email: Scalars['String'];
};

export type MutationResetPasswordArgs = {
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

export type GetChallengeQueryVariables = Exact<{ [key: string]: never }>;

export type GetChallengeQuery = { __typename?: 'Query' } & {
  me: { __typename?: 'User' } & Pick<User, 'id'>;
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

export type GetSettingsQueryVariables = Exact<{ [key: string]: never }>;

export type GetSettingsQuery = { __typename?: 'Query' } & {
  me: { __typename?: 'User' } & Pick<User, 'id'>;
};

export type AppDataQueryVariables = Exact<{ [key: string]: never }>;

export type AppDataQuery = { __typename?: 'Query' } & {
  me: { __typename?: 'User' } & AllUserPropsFragment;
};

export type AllUserPropsFragment = { __typename?: 'User' } & Pick<
  User,
  'id' | 'username'
>;

export const AllUserPropsFragmentDoc = gql`
  fragment allUserProps on User {
    id
    username
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
