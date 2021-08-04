import '../styles/globals.css';
import { ApolloProvider, gql } from '@apollo/client';
import { AppContext, AppProps } from 'next/app';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { getApolloClient } from '../getApolloClient';
import { AppDataDocument, AppDataQuery, User } from '../generated';
import React from 'react';
import { AuthModule } from 'src/features/AuthModule';
import { ErrorModalModule } from 'src/features/ErrorModalModule';
import { clearAccessToken, getAccessToken } from 'src/common/helper';
import { ConfirmEmailChecker } from 'src/features/ConfirmEmailChecker';

config.autoAddCss = false;

const client = getApolloClient();

interface GlobalProps {
  initialUser: User | null;
}

export default function App({
  Component,
  initialUser,
  pageProps,
}: AppProps & GlobalProps) {
  React.useEffect(() => {
    if (!initialUser && getAccessToken()) {
      clearAccessToken();
    }
  }, []);
  return (
    <ApolloProvider client={client}>
      <AuthModule initialUser={initialUser}>
        <ErrorModalModule>
          <Component {...pageProps} />
          <ConfirmEmailChecker />
        </ErrorModalModule>
      </AuthModule>
      <div id="portals" />
    </ApolloProvider>
  );
}

gql`
  query AppData {
    me {
      id
      username
      email
      isAdmin
      isVerified
      avatarId
    }
  }
  fragment allUserProps on User {
    id
    username
    email
    isAdmin
    isVerified
    avatarId
  }
`;

App.getInitialProps = async ({ ctx }: AppContext) => {
  const client = getApolloClient(ctx);
  if (!client.hasAccessToken()) {
    return {
      initialUser: null,
    };
  }
  try {
    const ret = await client.query<AppDataQuery>({
      query: AppDataDocument,
    });
    return {
      initialUser: ret.data.me,
    };
  } catch (e) {
    console.error(e);
    return {
      initialUser: null,
    };
  }
};
