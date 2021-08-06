import { WorkspaceNodeCollection } from '../../src/collections/WorkspaceNode';
import { updateWorkspaceNode } from '../../src/contracts/workspace/updateWorkspaceNode';
import { execContract, getUUID, setupDb } from '../helper';
import {
  createSampleChallenges,
  createSampleWorkspaceItems,
  createSampleWorkspaces,
  registerSampleUsers,
} from '../seed-data';

setupDb();

beforeEach(async () => {
  await registerSampleUsers();
  await createSampleChallenges();
  await createSampleWorkspaces();
  await createSampleWorkspaceItems();
});

it('should throw if no found', async () => {
  await expect(
    execContract(
      updateWorkspaceNode,
      {
        values: {
          id: getUUID(1123),
          name: 'abc',
        },
      },
      'user2_token'
    )
  ).rejects.toMatchInlineSnapshot(`[AppError: Node not found]`);
});

it('should throw if no permission', async () => {
  await expect(
    execContract(
      updateWorkspaceNode,
      {
        values: {
          id: getUUID(1),
          name: 'abc',
        },
      },

      'user2_token'
    )
  ).rejects.toMatchInlineSnapshot(
    `[Error: Not permission to access this workspace]`
  );
});

it('should throw if invalid parentId', async () => {
  await expect(
    execContract(
      updateWorkspaceNode,
      {
        values: {
          id: getUUID(1),
          parentId: '12345',
        },
      },
      'user1_token'
    )
  ).rejects.toMatchInlineSnapshot(`[AppError: Invalid parentId]`);
});

it('should throw if parent is not a directory', async () => {
  await expect(
    execContract(
      updateWorkspaceNode,
      {
        values: {
          id: getUUID(4),
          parentId: getUUID(1),
        },
      },
      'user1_token'
    )
  ).rejects.toMatchInlineSnapshot(
    `[AppError: Parent must be a directory type]`
  );
});

it('should throw if parent would make a cycle', async () => {
  await expect(
    execContract(
      updateWorkspaceNode,
      {
        values: {
          id: getUUID(2),
          parentId: getUUID(3),
        },
      },
      'user1_token'
    )
  ).rejects.toMatchInlineSnapshot(
    `[AppError: Invalid parentId. Parent is a child of this node.]`
  );
});

it('should throw if locked', async () => {
  const node = await WorkspaceNodeCollection.findByIdOrThrow(getUUID(1));
  node.isLocked = true;
  await WorkspaceNodeCollection.update(node, ['isLocked']);
  await expect(
    execContract(
      updateWorkspaceNode,
      {
        values: {
          id: getUUID(1),
          name: 'foo',
        },
      },
      'user1_token'
    )
  ).rejects.toMatchInlineSnapshot(`[AppError: Cannot update locked node]`);
});

it('should update hash', async () => {
  await execContract(
    updateWorkspaceNode,
    {
      values: {
        id: getUUID(1),
        hash: 'new-hash',
      },
    },
    'user1_token'
  );
  expect(await WorkspaceNodeCollection.findById(getUUID(1)))
    .toMatchInlineSnapshot(`
    Object {
      "_id": "00000000-0000-4000-8000-000000000001",
      "hash": "new-hash",
      "name": "index.tsx",
      "parentId": null,
      "sourceS3Key": "s1",
      "type": "file",
      "uniqueKey": "000000000000000000000010__file_index.tsx",
      "userId": "000000000000000000000001",
      "workspaceId": "000000000000000000000010",
    }
  `);
});

it('should update name', async () => {
  await execContract(
    updateWorkspaceNode,
    {
      values: {
        id: getUUID(1),
        name: 'new-name',
      },
    },
    'user1_token'
  );
  expect(await WorkspaceNodeCollection.findById(getUUID(1)))
    .toMatchInlineSnapshot(`
    Object {
      "_id": "00000000-0000-4000-8000-000000000001",
      "hash": "123",
      "name": "new-name",
      "parentId": null,
      "sourceS3Key": "s1",
      "type": "file",
      "uniqueKey": "000000000000000000000010__file_new-name",
      "userId": "000000000000000000000001",
      "workspaceId": "000000000000000000000010",
    }
  `);
});

it('should update parentId', async () => {
  await execContract(
    updateWorkspaceNode,
    {
      values: {
        id: getUUID(4),
        parentId: getUUID(2),
      },
    },
    'user1_token'
  );
  expect(await WorkspaceNodeCollection.findById(getUUID(4)))
    .toMatchInlineSnapshot(`
    Object {
      "_id": "00000000-0000-4000-8000-000000000004",
      "hash": "123",
      "name": "Button.tsx",
      "parentId": "00000000-0000-4000-8000-000000000002",
      "sourceS3Key": "s2",
      "type": "file",
      "uniqueKey": "000000000000000000000010_00000000-0000-4000-8000-000000000002_file_button.tsx",
      "userId": "000000000000000000000001",
      "workspaceId": "000000000000000000000010",
    }
  `);
});

it('should update parentId to root', async () => {
  await execContract(
    updateWorkspaceNode,
    {
      values: {
        id: getUUID(4),
        parentId: null,
      },
    },
    'user1_token'
  );
  expect(await WorkspaceNodeCollection.findById(getUUID(4)))
    .toMatchInlineSnapshot(`
    Object {
      "_id": "00000000-0000-4000-8000-000000000004",
      "hash": "123",
      "name": "Button.tsx",
      "parentId": null,
      "sourceS3Key": "s2",
      "type": "file",
      "uniqueKey": "000000000000000000000010__file_button.tsx",
      "userId": "000000000000000000000001",
      "workspaceId": "000000000000000000000010",
    }
  `);
});
