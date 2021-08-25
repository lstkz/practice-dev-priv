import { WorkspaceCollection } from '../../src/collections/Workspace';
import { getWorkspaceS3Auth } from '../../src/contracts/workspace/getWorkspaceS3Auth';
import { sts } from '../../src/lib';
import { execContract, getId, setupDb } from '../helper';
import {
  createSampleChallenges,
  createSampleWorkspaces,
  registerSampleUsers,
} from '../seed-data';

setupDb();

beforeEach(async () => {
  await registerSampleUsers();
  await createSampleChallenges();
  await createSampleWorkspaces();
  sts.assumeRole = () =>
    ({
      promise: async () => ({
        Credentials: {
          AccessKeyId: 'key1',
          SecretAccessKey: 'secret1',
          SessionToken: 'token1',
        },
      }),
    } as any);
  Date.now = () => new Date(2000, 0, 1).getTime();
});

it('should throw if no found', async () => {
  await expect(
    execContract(getWorkspaceS3Auth, { workspaceId: getId(121) }, 'user1_token')
  ).rejects.toMatchInlineSnapshot(`[AppError: Workspace not found]`);
});

it('should throw if no permission', async () => {
  await expect(
    execContract(getWorkspaceS3Auth, { workspaceId: getId(10) }, 'user2_token')
  ).rejects.toMatchInlineSnapshot(
    `[Error: No permission to access this workspace]`
  );
});

it('should it create credentials if null', async () => {
  let workspace = await WorkspaceCollection.findByIdOrThrow(getId(10));
  workspace.s3Auth = null!;
  await WorkspaceCollection.update(workspace, ['s3Auth']);
  expect(
    await execContract(
      getWorkspaceS3Auth,
      { workspaceId: getId(10) },
      'user1_token'
    )
  ).toMatchInlineSnapshot(`
    Object {
      "bucketName": "s3-bucket-123",
      "credentials": Object {
        "accessKeyId": "key1",
        "secretAccessKey": "secret1",
        "sessionToken": "token1",
      },
    }
  `);
  workspace = await WorkspaceCollection.findByIdOrThrow(getId(10));
  expect(workspace.s3Auth).toBeTruthy();
});

it('should it return existing if not expired', async () => {
  const workspace = await WorkspaceCollection.findByIdOrThrow(getId(10));
  workspace.s3Auth = {
    bucketName: '123',
    credentials: {
      accessKeyId: 'a',
      secretAccessKey: 'b',
      sessionToken: 'c',
    },
    credentialsExpiresAt: new Date(Date.now() + 10000),
  };
  await WorkspaceCollection.update(workspace, ['s3Auth']);
  expect(
    await execContract(
      getWorkspaceS3Auth,
      { workspaceId: getId(10) },
      'user1_token'
    )
  ).toMatchInlineSnapshot(`
    Object {
      "bucketName": "123",
      "credentials": Object {
        "accessKeyId": "a",
        "secretAccessKey": "b",
        "sessionToken": "c",
      },
    }
  `);
});

it('should it return renew if expired', async () => {
  const workspace = await WorkspaceCollection.findByIdOrThrow(getId(10));
  workspace.s3Auth = {
    bucketName: '123',
    credentials: {
      accessKeyId: 'a',
      secretAccessKey: 'b',
      sessionToken: 'c',
    },
    credentialsExpiresAt: new Date(Date.now() - 10000),
  };
  await WorkspaceCollection.update(workspace, ['s3Auth']);
  expect(
    await execContract(
      getWorkspaceS3Auth,
      { workspaceId: getId(10) },
      'user1_token'
    )
  ).toMatchInlineSnapshot(`
    Object {
      "bucketName": "s3-bucket-123",
      "credentials": Object {
        "accessKeyId": "key1",
        "secretAccessKey": "secret1",
        "sessionToken": "token1",
      },
    }
  `);
});
