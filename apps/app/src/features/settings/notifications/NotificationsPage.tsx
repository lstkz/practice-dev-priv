import React from 'react';
import { SettingsPageTemplate } from '../SettingsPageTemplate';
import { createGetServerSideProps, createSSRClient } from 'src/common/helper';
import { InferGetServerSidePropsType } from 'next';
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

export const getServerSideProps = createGetServerSideProps(async ctx => {
  const api = createSSRClient(ctx);
  return {
    props: {
      initialValues: await api.user_getNotificationSettings(),
    },
  };
});
