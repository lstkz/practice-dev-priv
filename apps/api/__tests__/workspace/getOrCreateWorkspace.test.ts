import { gql } from 'apollo-server';
import { mocked } from 'ts-jest/utils';
import { WorkspaceCollection } from '../../src/collections/Workspace';
import {
  WorkspaceNodeCollection,
  WorkspaceNodeType,
} from '../../src/collections/WorkspaceNode';
import { getWorkspaceNodeWithUniqueKey } from '../../src/common/workspace-tree';
import { getOrCreateWorkspace } from '../../src/contracts/workspace/getOrCreateWorkspace';
import { dispatchTask } from '../../src/dispatch';
import { sts } from '../../src/lib';
import { apolloServer } from '../../src/server';
import { getAppUser, getId, getTokenOptions, setupDb } from '../helper';
import { createSampleChallenges, registerSampleUsers } from '../seed-data';

jest.mock('../../src/dispatch');

const mocked_dispatchTask = mocked(dispatchTask);

setupDb();

beforeEach(async () => {
  await registerSampleUsers();
  await createSampleChallenges();
  mocked_dispatchTask.mockClear();
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
  Date.now = () => 1;
});

it('should throw if challenge not found', async () => {
  await expect(
    getOrCreateWorkspace(await getAppUser(1), { challengeUniqId: '12_32' })
  ).rejects.toMatchInlineSnapshot(`[AppError: Challenge not found: 12_32]`);
});

it('should create a workspace', async () => {
  const ret = await getOrCreateWorkspace(await getAppUser(1), {
    challengeUniqId: '1_2',
  });
  expect(mocked_dispatchTask).toBeCalled();
  expect(ret.isReady).toEqual(false);
  expect(ret.items).toEqual([]);
});

it('should return an existing workspace', async () => {
  await WorkspaceCollection.insertOne({
    _id: getId(100),
    challengeUniqId: '1_2',
    dedupKey: `1_2_${getId(1)}_default`,
    isReady: true,
    userId: getId(1),
    s3Auth: null!,
    libraries: [
      {
        name: 'lib',
        source: 's',
        types: 't',
      },
    ],
  });
  await WorkspaceNodeCollection.insertMany([
    getWorkspaceNodeWithUniqueKey({
      _id: '1',
      hash: 'h1',
      name: 'file.tsx',
      parentId: null,
      type: WorkspaceNodeType.File,
      userId: getId(1),
      workspaceId: getId(100),
    }),
    getWorkspaceNodeWithUniqueKey({
      _id: '2',
      hash: 'h2',
      name: 'file.tsx',
      parentId: null,
      type: WorkspaceNodeType.File,
      userId: getId(1),
      workspaceId: getId(101),
    }),
  ]);
  const ret = await getOrCreateWorkspace(await getAppUser(1), {
    challengeUniqId: '1_2',
  });
  expect(mocked_dispatchTask).not.toBeCalled();
  expect(ret).toMatchInlineSnapshot(`
Object {
  "id": "000000000000000000000100",
  "isReady": true,
  "items": Array [
    Object {
      "hash": "h1",
      "id": "1",
      "name": "file.tsx",
      "parentId": null,
      "type": "file",
      "uniqueKey": "000000000000000000000100__file_file.tsx",
      "userId": "000000000000000000000001",
      "workspaceId": "000000000000000000000100",
    },
  ],
  "libraries": Array [
    Object {
      "name": "lib",
      "source": "s",
      "types": "t",
    },
  ],
  "s3Auth": Object {
    "bucketName": "s3-bucket-123",
    "credentials": Object {
      "accessKeyId": "key1",
      "secretAccessKey": "secret1",
      "sessionToken": "token1",
    },
  },
}
`);
});

it('should create a workspace #graphql', async () => {
  const res = await apolloServer.executeOperation(
    {
      query: gql`
        mutation {
          getOrCreateWorkspace(values: { challengeUniqId: "1_2" }) {
            isReady
          }
        }
      `,
    },
    getTokenOptions('user1_token')
  );
  expect(res.errors).toBeFalsy();
  expect(res.data).toMatchInlineSnapshot(`
Object {
  "getOrCreateWorkspace": Object {
    "isReady": false,
  },
}
`);
});
