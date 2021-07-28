import { gql } from 'apollo-server';
import { WorkspaceNodeCollection } from '../../src/collections/WorkspaceNode';
import { updateWorkspaceNode } from '../../src/contracts/workspace/updateWorkspaceNode';
import { apolloServer } from '../../src/server';
import { getAppUser, getTokenOptions, getUUID, setupDb } from '../helper';
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

it('should throw if no permission', async () => {
  await expect(
    updateWorkspaceNode(await getAppUser(2), {
      id: getUUID(1),
      name: 'abc',
    })
  ).rejects.toMatchInlineSnapshot(
    `[ForbiddenError: Not permission to access this workspace]`
  );
});

it('should throw if invalid parentId', async () => {
  await expect(
    updateWorkspaceNode(await getAppUser(1), {
      id: getUUID(1),
      parentId: '12345',
    })
  ).rejects.toMatchInlineSnapshot(`[AppError: Invalid parentId]`);
});

it('should throw if parent is not a directory', async () => {
  await expect(
    updateWorkspaceNode(await getAppUser(1), {
      id: getUUID(4),
      parentId: getUUID(1),
    })
  ).rejects.toMatchInlineSnapshot(
    `[AppError: Parent must be a directory type]`
  );
});

it('should throw if parent would make a cycle', async () => {
  await expect(
    updateWorkspaceNode(await getAppUser(1), {
      id: getUUID(2),
      parentId: getUUID(3),
    })
  ).rejects.toMatchInlineSnapshot(
    `[AppError: Invalid parentId. Parent is a child of this node.]`
  );
});

it('should update hash', async () => {
  await updateWorkspaceNode(await getAppUser(1), {
    id: getUUID(1),
    hash: 'new-hash',
  });
  expect(await WorkspaceNodeCollection.findById(getUUID(1)))
    .toMatchInlineSnapshot(`
    Object {
      "_id": "00000000-0000-4000-8000-000000000001",
      "hash": "new-hash",
      "name": "index.tsx",
      "parentId": null,
      "type": "file",
      "uniqueKey": "000000000000000000000010__file_index.tsx",
      "userId": "000000000000000000000001",
      "workspaceId": "000000000000000000000010",
    }
  `);
});

it('should update name', async () => {
  await updateWorkspaceNode(await getAppUser(1), {
    id: getUUID(1),
    name: 'new-name',
  });
  expect(await WorkspaceNodeCollection.findById(getUUID(1)))
    .toMatchInlineSnapshot(`
    Object {
      "_id": "00000000-0000-4000-8000-000000000001",
      "hash": "123",
      "name": "new-name",
      "parentId": null,
      "type": "file",
      "uniqueKey": "000000000000000000000010__file_new-name",
      "userId": "000000000000000000000001",
      "workspaceId": "000000000000000000000010",
    }
  `);
});

it('should update parentId', async () => {
  await updateWorkspaceNode(await getAppUser(1), {
    id: getUUID(4),
    parentId: getUUID(2),
  });
  expect(await WorkspaceNodeCollection.findById(getUUID(4)))
    .toMatchInlineSnapshot(`
    Object {
      "_id": "00000000-0000-4000-8000-000000000004",
      "hash": "123",
      "name": "Button.tsx",
      "parentId": "00000000-0000-4000-8000-000000000002",
      "type": "file",
      "uniqueKey": "000000000000000000000010_00000000-0000-4000-8000-000000000002_file_button.tsx",
      "userId": "000000000000000000000001",
      "workspaceId": "000000000000000000000010",
    }
  `);
});

it('should update parentId to root', async () => {
  await updateWorkspaceNode(await getAppUser(1), {
    id: getUUID(4),
    parentId: null,
  });
  expect(await WorkspaceNodeCollection.findById(getUUID(4)))
    .toMatchInlineSnapshot(`
    Object {
      "_id": "00000000-0000-4000-8000-000000000004",
      "hash": "123",
      "name": "Button.tsx",
      "parentId": null,
      "type": "file",
      "uniqueKey": "000000000000000000000010__file_button.tsx",
      "userId": "000000000000000000000001",
      "workspaceId": "000000000000000000000010",
    }
  `);
});

it('should create a node #graphql', async () => {
  const res = await apolloServer.executeOperation(
    {
      query: gql`
        mutation ($values: UpdateWorkspaceNodeInput!) {
          updateWorkspaceNode(values: $values)
        }
      `,
      variables: {
        values: {
          id: getUUID(4),
          parentId: getUUID(2),
        },
      },
    },
    getTokenOptions('user1_token')
  );
  expect(res.errors).toBeFalsy();
});
