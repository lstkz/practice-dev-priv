import React from 'react';
import { SettingsPageTemplate } from '../SettingsPageTemplate';
import { createGetServerSideProps, createSSRClient } from 'src/common/helper';
import { InferGetServerSidePropsType } from 'next';
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

export const getServerSideProps = createGetServerSideProps(async ctx => {
  const api = createSSRClient(ctx);
  return {
    props: {
      initialValues: await api.user_getMyProfile(),
    },
  };
});
