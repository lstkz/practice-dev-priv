import React from 'react';
import { SettingsPageTemplate } from '../SettingsPageTemplate';
import { createGetServerSideProps } from 'src/common/helper';
import { InferGetServerSidePropsType } from 'next';
import { gql } from '@apollo/client';
import { getApolloClient } from 'src/getApolloClient';
import {
  GetNotificationSettingsDocument,
  GetNotificationSettingsQuery,
} from 'src/generated';
import { NotificationsSection } from './NotificationsSection';

export function NotificationsPage(props: NotificationsSSRProps) {
  return (
    <SettingsPageTemplate>
      <NotificationsSection initialValues={props.initialValues} />
    </SettingsPageTemplate>
  );
}

export type NotificationsSSRProps = InferGetServerSidePropsType<
  typeof getServerSideProps
>;

gql`
  query GetNotificationSettings {
    getNotificationSettings {
      newsletter
    }
  }
`;

export const getServerSideProps = createGetServerSideProps(async ctx => {
  const client = getApolloClient(ctx);
  const ret = await client.query<GetNotificationSettingsQuery>({
    query: GetNotificationSettingsDocument,
  });

  return {
    props: {
      initialValues: ret.data.getNotificationSettings,
    },
  };
});
