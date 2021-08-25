import { WorkspaceNodeType } from 'shared';
import { WorkspaceCollection } from '../../src/collections/Workspace';
import { WorkspaceNodeCollection } from '../../src/collections/WorkspaceNode';
import { getWorkspaceNodeWithUniqueKey } from '../../src/common/workspace-tree';
import { getOrCreateWorkspace } from '../../src/contracts/workspace/getOrCreateWorkspace';
import { s3, sts } from '../../src/lib';
import { execContract, getId, setupDb } from '../helper';
import { createSampleChallenges, registerSampleUsers } from '../seed-data';

let mocked_copyObject: jest.Mock<any, []> = null!;

setupDb();

beforeEach(async () => {
  await registerSampleUsers();
  await createSampleChallenges();
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
  mocked_copyObject = jest.fn(
    () =>
      ({
        promise: async () => ({}),
      } as any)
  );
  s3.copyObject = mocked_copyObject;
  Date.now = () => 1;
});

it('should throw if challenge not found', async () => {
  await expect(
    execContract(
      getOrCreateWorkspace,
      { values: { challengeId: '12_32' } },
      'user1_token'
    )
  ).rejects.toMatchInlineSnapshot(`[AppError: Challenge not found: 12_32]`);
});

it('should create a workspace', async () => {
  const ret = await execContract(
    getOrCreateWorkspace,
    { values: { challengeId: '1_2' } },
    'user1_token'
  );
  expect(ret.items).toHaveLength(4);
});

it('should create a workspace and return the same files if parallel requests', async () => {
  const exec = () =>
    execContract(
      getOrCreateWorkspace,
      { values: { challengeId: '1_2' } },
      'user1_token'
    );
  const ret = await Promise.all([exec(), exec(), exec()]);
  expect(ret[0].items).toEqual(ret[1].items);
  expect(ret[1].items).toEqual(ret[2].items);
});

it('should return an existing workspace', async () => {
  await WorkspaceCollection.insertOne({
    _id: getId(100),
    challengeId: '1_2',
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
      isLocked: true,
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
  const ret = await execContract(
    getOrCreateWorkspace,
    { values: { challengeId: '1_2' } },
    'user1_token'
  );

  expect(ret).toMatchInlineSnapshot(`
Object {
  "id": "000000000000000000000100",
  "items": Array [
    Object {
      "hash": "h1",
      "id": "1",
      "isLocked": true,
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
