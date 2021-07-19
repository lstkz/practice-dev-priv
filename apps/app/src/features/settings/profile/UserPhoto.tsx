import { gql, useApolloClient } from '@apollo/client';
import React from 'react';
import { Button } from 'src/components/Button';
import { UserAvatar } from 'src/components/UserAvatar';
import { useAuthActions, useUser } from 'src/features/AuthModule';
import { useErrorModalActions } from 'src/features/ErrorModalModule';
import {
  GetAvatarUploadUrlDocument,
  GetAvatarUploadUrlQuery,
  useCompleteAvatarUploadMutation,
  useDeleteAvatarMutation,
} from 'src/generated';
import { CropModal, CropModalRef } from './CropModal';

gql`
  query GetAvatarUploadUrl {
    getAvatarUploadUrl {
      url
      fields {
        name
        value
      }
    }
  }
`;
gql`
  mutation CompleteAvatarUpload {
    completeAvatarUpload {
      avatarId
    }
  }
`;
gql`
  mutation DeleteAvatar {
    deleteAvatar
  }
`;

export function UserPhoto() {
  const fileRef = React.useRef<HTMLInputElement | null>(null);
  const [key, setKey] = React.useState(1);
  const user = useUser();

  const cropModalRef = React.useRef<CropModalRef>(null!);

  const showPhoto = () => {
    fileRef.current!.click();
  };
  const [isLoading, setIsLoading] = React.useState(false);
  const { show: showError } = useErrorModalActions();
  const client = useApolloClient();
  const [completeAvatarUpload] = useCompleteAvatarUploadMutation();
  const [deleteAvatar] = useDeleteAvatarMutation();
  const { updateUser } = useAuthActions();

  const buttons = (
    <div tw="space-x-2 mt-2 flex items-center justify-center">
      <Button
        htmlType="button"
        type="white"
        size="small"
        onClick={showPhoto}
        loading={isLoading}
      >
        {user.avatarId ? 'Update' : 'Upload'}
      </Button>
      {user.avatarId && (
        <Button
          htmlType="button"
          type="white"
          size="small"
          onClick={async () => {
            await deleteAvatar();
            updateUser({
              avatarId: null,
            });
          }}
        >
          Remove
        </Button>
      )}
    </div>
  );

  return (
    <>
      <CropModal
        ref={cropModalRef}
        onImage={async img => {
          try {
            setIsLoading(true);
            const avatarRet = await client.query<GetAvatarUploadUrlQuery>({
              query: GetAvatarUploadUrlDocument,
            });
            const { url, fields } = avatarRet.data.getAvatarUploadUrl;
            const formData = new FormData();
            fields.forEach(field => {
              formData.append(field.name, field.value);
            });
            formData.append('file', img);
            const ret = await fetch(url, {
              method: 'POST',
              body: formData,
            });
            if (ret.status < 200 || ret.status > 299) {
              throw new Error('Failed to upload an image!');
            }
            const completeRet = await completeAvatarUpload();
            const avatarId = completeRet.data!.completeAvatarUpload.avatarId;
            updateUser({ avatarId });
          } catch (e) {
            showError(e);
          } finally {
            setIsLoading(false);
          }
        }}
      />
      <div tw="mt-6 flex-grow lg:mt-0 lg:ml-6 lg:flex-grow-0 lg:flex-shrink-0">
        <p tw="text-sm font-medium text-gray-700" aria-hidden="true">
          Photo
        </p>
        <div tw="mt-1 lg:hidden">
          <div tw="flex items-center">
            <div
              tw="flex-shrink-0 inline-block rounded-full overflow-hidden h-12 w-12"
              aria-hidden="true"
            >
              <UserAvatar user={user} size="lg" />
            </div>
            <div tw="ml-5 rounded-md shadow-sm">{buttons}</div>
          </div>
        </div>
        <div tw="hidden lg:block">
          <div tw="relative rounded-full overflow-hidden flex justify-center">
            <UserAvatar user={user} size="xl" />
          </div>
          {buttons}
        </div>
        <input
          key={key}
          type="file"
          tw="hidden"
          ref={fileRef}
          onChange={e => {
            const file = e.target.files?.[0];
            if (file) {
              cropModalRef.current.open(URL.createObjectURL(file));
              setKey(key + 1);
            }
          }}
        />
      </div>
    </>
  );
}
