import { gql } from 'apollo-server';
import { WorkspaceCollection } from '../../src/collections/Workspace';
import { getWorkspaceS3Auth } from '../../src/contracts/workspace/getWorkspaceS3Auth';
import { sts } from '../../src/lib';
import { apolloServer } from '../../src/server';
import { getAppUser, getId, getTokenOptions, setupDb } from '../helper';
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
  sts.getFederationToken = () =>
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
    getWorkspaceS3Auth(await getAppUser(1), getId(121))
  ).rejects.toMatchInlineSnapshot(`[AppError: Workspace not found]`);
});

it('should throw if no permission', async () => {
  await expect(
    getWorkspaceS3Auth(await getAppUser(2), getId(10))
  ).rejects.toMatchInlineSnapshot(
    `[ForbiddenError: No permission to access this workspace]`
  );
});

it('should it create credentials if null', async () => {
  const workspace = await WorkspaceCollection.findByIdOrThrow(getId(10));
  workspace.s3Auth = null!;
  await WorkspaceCollection.update(workspace, ['s3Auth']);
  expect(await getWorkspaceS3Auth(await getAppUser(1), getId(10)))
    .toMatchInlineSnapshot(`
    Object {
      "bucketName": "s3-bucket-123",
      "credentials": Object {
        "accessKeyId": "key1",
        "secretAccessKey": "secret1",
        "sessionToken": "token1",
      },
      "credentialsExpiresAt": "2000-01-01T01:30:00.000Z",
    }
  `);
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
  expect(await getWorkspaceS3Auth(await getAppUser(1), getId(10)))
    .toMatchInlineSnapshot(`
    Object {
      "bucketName": "123",
      "credentials": Object {
        "accessKeyId": "a",
        "secretAccessKey": "b",
        "sessionToken": "c",
      },
      "credentialsExpiresAt": "1999-12-31T23:00:10.000Z",
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
  expect(await getWorkspaceS3Auth(await getAppUser(1), getId(10)))
    .toMatchInlineSnapshot(`
    Object {
      "bucketName": "s3-bucket-123",
      "credentials": Object {
        "accessKeyId": "key1",
        "secretAccessKey": "secret1",
        "sessionToken": "token1",
      },
      "credentialsExpiresAt": "2000-01-01T01:30:00.000Z",
    }
  `);
});

it('should return credentials #graphql', async () => {
  const res = await apolloServer.executeOperation(
    {
      query: gql`
        query ($workspaceId: String!) {
          getWorkspaceS3Auth(workspaceId: $workspaceId) {
            bucketName
            credentials {
              accessKeyId
              secretAccessKey
              sessionToken
            }
            credentialsExpiresAt
          }
        }
      `,
      variables: {
        workspaceId: getId(10).toHexString(),
      },
    },
    getTokenOptions('user1_token')
  );
  expect(res.errors).toBeFalsy();
  expect(res.data).toMatchInlineSnapshot(`
Object {
  "getWorkspaceS3Auth": Object {
    "bucketName": "s3-bucket-123",
    "credentials": Object {
      "accessKeyId": "key1",
      "secretAccessKey": "secret1",
      "sessionToken": "token1",
    },
    "credentialsExpiresAt": "2000-01-01T01:30:00.000Z",
  },
}
`);
});
