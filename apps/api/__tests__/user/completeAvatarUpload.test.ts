import { gql } from 'apollo-server';
import { s3 } from '../../src/lib';
import { apolloServer } from '../../src/server';
import jimp from 'jimp';
import { getAppUser, getId, getTokenOptions, setupDb } from '../helper';
import { registerSampleUsers } from '../seed-data';
import { completeAvatarUpload } from '../../src/contracts/user/completeAvatarUpload';
import { UserCollection } from '../../src/collections/User';

setupDb();

beforeEach(async () => {
  await registerSampleUsers();
});

function mockImage(width: number, height: number) {
  s3.getObject = () =>
    ({
      promise: async () => {
        const img = await jimp.create(width, height);
        const buffer = await img.getBufferAsync('image/png');
        return {
          Body: buffer,
        };
      },
    } as any);
}

it('should throw an error if wrong size', async () => {
  mockImage(2, 3);
  await expect(completeAvatarUpload(await getAppUser(1))).rejects.toThrow(
    'Image must be square'
  );
});

it('should throw an error if invalid image', async () => {
  s3.getObject = () =>
    ({
      promise: async () => {
        return {
          Body: Buffer.from('aaaaaaaaaaa'),
        };
      },
    } as any);
  await expect(completeAvatarUpload(await getAppUser(1))).rejects.toThrow(
    'Uploaded file is not a valid image'
  );
});

it('should complete upload', async () => {
  mockImage(10, 10);
  s3.upload = () =>
    ({
      promise: async () => {},
    } as any);
  let user = await UserCollection.findByIdOrThrow(getId(1));
  expect(user.avatarId).toBeFalsy();
  await completeAvatarUpload(await getAppUser(1));
  user = await UserCollection.findByIdOrThrow(getId(1));
  expect(user.avatarId).toBeTruthy();
});

it('should complete upload #graphql', async () => {
  mockImage(10, 10);
  s3.upload = () =>
    ({
      promise: async () => {},
    } as any);

  const res = await apolloServer.executeOperation(
    {
      query: gql`
        mutation {
          completeAvatarUpload {
            avatarId
          }
        }
      `,
    },
    getTokenOptions('user1_token')
  );
  expect(res.errors).toBeFalsy();
  expect(res.data?.completeAvatarUpload.avatarId).toBeDefined();
});
