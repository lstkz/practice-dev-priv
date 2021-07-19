import React from 'react';
import { SettingsPageTemplate } from '../SettingsPageTemplate';
import { createGetServerSideProps } from 'src/common/helper';
import { InferGetServerSidePropsType } from 'next';
import { gql } from '@apollo/client';
import { getApolloClient } from 'src/getApolloClient';
import { GetMyProfileDocument, GetMyProfileQuery } from 'src/generated';
import { ProfileSection } from './ProfileSection';

export function ProfilePage(props: ProfileSSRProps) {
  return (
    <SettingsPageTemplate>
      <ProfileSection initialValues={props.initialValues} />
    </SettingsPageTemplate>
  );
}

export type ProfileSSRProps = InferGetServerSidePropsType<
  typeof getServerSideProps
>;

gql`
  query GetMyProfile {
    getMyProfile {
      name
      about
      country
      url
    }
  }
`;

export const getServerSideProps = createGetServerSideProps(async ctx => {
  const client = getApolloClient(ctx);
  const ret = await client.query<GetMyProfileQuery>({
    query: GetMyProfileDocument,
  });

  return {
    props: {
      initialValues: ret.data.getMyProfile,
    },
  };
});
