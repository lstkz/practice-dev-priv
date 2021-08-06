import { WorkspaceNodeType } from 'shared';
import { WorkspaceNodeCollection } from '../../src/collections/WorkspaceNode';
import { createWorkspaceNode } from '../../src/contracts/workspace/createWorkspaceNode';
import { getId, getUUID, setupDb, execContract } from '../helper';
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
});

function getValidValues() {
  return {
    id: getUUID(1),
    workspaceId: getId(10),
    parentId: null,
    hash: '123',
    type: WorkspaceNodeType.File,
    name: 'index.tsx',
  };
}

it('should throw if duplicated id', async () => {
  await execContract(
    createWorkspaceNode,
    { values: getValidValues() },
    'user1_token'
  );
  await expect(
    execContract(
      createWorkspaceNode,
      { values: getValidValues() },
      'user1_token'
    )
  ).rejects.toMatchInlineSnapshot(`[AppError: Duplicated id]`);
});

it('should throw if workspace not found', async () => {
  await expect(
    execContract(
      createWorkspaceNode,
      {
        values: {
          ...getValidValues(),
          workspaceId: getId(1234),
        },
      },
      'user1_token'
    )
  ).rejects.toMatchInlineSnapshot(`[AppError: Workspace not found]`);
});

it('should throw if no permission', async () => {
  await expect(
    execContract(
      createWorkspaceNode,
      {
        values: getValidValues(),
      },
      'user2_token'
    )
  ).rejects.toMatchInlineSnapshot(
    `[ForbiddenError: Not permission to access this workspace]`
  );
});

it('should throw if invalid parentId', async () => {
  await expect(
    execContract(
      createWorkspaceNode,
      {
        values: {
          ...getValidValues(),
          parentId: '12345',
        },
      },
      'user1_token'
    )
  ).rejects.toMatchInlineSnapshot(`[AppError: Invalid parentId]`);
});

it('should throw if parent belongs to different workspace', async () => {
  await execContract(
    createWorkspaceNode,
    {
      values: getValidValues(),
    },
    'user1_token'
  );
  await expect(
    execContract(
      createWorkspaceNode,
      {
        values: {
          ...getValidValues(),
          id: getUUID(2),
          workspaceId: getId(11),
          parentId: getUUID(1),
        },
      },
      'user1_token'
    )
  ).rejects.toMatchInlineSnapshot(
    `[AppError: Parent must belong to the same workspace]`
  );
});

it('should throw if parent is not a directory', async () => {
  await execContract(
    createWorkspaceNode,
    {
      values: {
        ...getValidValues(),
        type: WorkspaceNodeType.File,
      },
    },
    'user1_token'
  );
  await expect(
    execContract(
      createWorkspaceNode,
      {
        values: {
          ...getValidValues(),
          id: getUUID(2),
          parentId: getUUID(1),
        },
      },
      'user1_token'
    )
  ).rejects.toMatchInlineSnapshot(
    `[AppError: Parent must be a directory type]`
  );
});

it('should throw if duplicated name (root)', async () => {
  await execContract(
    createWorkspaceNode,
    {
      values: {
        ...getValidValues(),
        name: 'Foo',
      },
    },
    'user1_token'
  );
  await expect(
    execContract(
      createWorkspaceNode,
      {
        values: {
          ...getValidValues(),
          id: getUUID(2),
          name: 'foo',
        },
      },
      'user1_token'
    )
  ).rejects.toMatchInlineSnapshot(
    `[AppError: Duplicated node name in the same folder.]`
  );
});

it('should throw if duplicated name (nested directory)', async () => {
  await execContract(
    createWorkspaceNode,
    {
      values: {
        ...getValidValues(),
        name: 'dir',
        type: WorkspaceNodeType.Directory,
      },
    },
    'user1_token'
  );
  await execContract(
    createWorkspaceNode,
    {
      values: {
        ...getValidValues(),
        id: getUUID(2),
        parentId: getUUID(1),
        name: 'Foo',
      },
    },
    'user1_token'
  );
  await expect(
    execContract(
      createWorkspaceNode,
      {
        values: {
          ...getValidValues(),
          id: getUUID(3),
          parentId: getUUID(1),
          name: 'foo',
        },
      },
      'user1_token'
    )
  ).rejects.toMatchInlineSnapshot(
    `[AppError: Duplicated node name in the same folder.]`
  );
});

it('should create a root node', async () => {
  await execContract(
    createWorkspaceNode,
    {
      values: getValidValues(),
    },
    'user1_token'
  );
  expect(await WorkspaceNodeCollection.findAll({})).toMatchInlineSnapshot(`
    Array [
      Object {
        "_id": "00000000-0000-4000-8000-000000000001",
        "hash": "123",
        "name": "index.tsx",
        "parentId": null,
        "s3Key": "cdn/workspace/000000000000000000000010/00000000-0000-4000-8000-000000000001",
        "sourceS3Key": null,
        "type": "file",
        "uniqueKey": "000000000000000000000010__file_index.tsx",
        "userId": "000000000000000000000001",
        "workspaceId": "000000000000000000000010",
      },
    ]
  `);
});

it('should create a nested node', async () => {
  await execContract(
    createWorkspaceNode,
    {
      values: {
        ...getValidValues(),
        name: 'dir',
        type: WorkspaceNodeType.Directory,
      },
    },
    'user1_token'
  );
  await execContract(
    createWorkspaceNode,
    {
      values: {
        ...getValidValues(),
        id: getUUID(2),
        parentId: getUUID(1),
        name: 'Foo',
      },
    },
    'user1_token'
  );
  expect(await WorkspaceNodeCollection.findById(getUUID(2)))
    .toMatchInlineSnapshot(`
    Object {
      "_id": "00000000-0000-4000-8000-000000000002",
      "hash": "123",
      "name": "Foo",
      "parentId": "00000000-0000-4000-8000-000000000001",
      "s3Key": "cdn/workspace/000000000000000000000010/00000000-0000-4000-8000-000000000002",
      "sourceS3Key": null,
      "type": "file",
      "uniqueKey": "000000000000000000000010_00000000-0000-4000-8000-000000000001_file_foo",
      "userId": "000000000000000000000001",
      "workspaceId": "000000000000000000000010",
    }
  `);
});

it('should create file and directory with same name', async () => {
  await execContract(
    createWorkspaceNode,
    {
      values: {
        ...getValidValues(),
        name: 'foo',
        type: WorkspaceNodeType.Directory,
      },
    },
    'user1_token'
  );
  await execContract(
    createWorkspaceNode,
    {
      values: {
        ...getValidValues(),
        id: getUUID(2),
        name: 'foo',
        type: WorkspaceNodeType.File,
      },
    },
    'user1_token'
  );
});
