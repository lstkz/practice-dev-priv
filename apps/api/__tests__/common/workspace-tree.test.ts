import { createWorkspaceNodes } from '../../src/common/workspace-tree';
import { getId } from '../helper';

jest.mock('uuid', () => {
  let next = 1;
  return {
    v4: () => `mock-${next++}`,
  };
});

describe('createWorkspaceNodes', () => {
  it('should create a tree without directories', () => {
    expect(
      createWorkspaceNodes(
        {
          userId: getId(1),
          workspaceId: getId(2),
        },

        [
          {
            directory: '.',
            name: 'index.tsx',
            s3Key: 's3key-index',
          },

          {
            directory: '.',
            name: 'App.tsx',
            s3Key: 's3key-app',
          },
        ]
      )
    ).toMatchInlineSnapshot(`
      Array [
        Object {
          "_id": "mock-1",
          "hash": "init",
          "name": "index.tsx",
          "parentId": null,
          "sourceS3Key": "s3key-index",
          "type": "file",
          "userId": "000000000000000000000001",
          "workspaceId": "000000000000000000000002",
        },
        Object {
          "_id": "mock-2",
          "hash": "init",
          "name": "App.tsx",
          "parentId": null,
          "sourceS3Key": "s3key-app",
          "type": "file",
          "userId": "000000000000000000000001",
          "workspaceId": "000000000000000000000002",
        },
      ]
    `);
  });
  it('should create a tree with directories', () => {
    expect(
      createWorkspaceNodes(
        {
          userId: getId(1),
          workspaceId: getId(2),
        },

        [
          {
            directory: '.',
            name: 'index.tsx',
            s3Key: '',
          },

          {
            directory: 'components/main',
            name: 'App.tsx',
            s3Key: '',
          },

          {
            directory: 'components/main/foo',
            name: 'Button.tsx',
            s3Key: '',
          },
        ]
      )
    ).toMatchInlineSnapshot(`
      Array [
        Object {
          "_id": "mock-3",
          "hash": "init",
          "name": "index.tsx",
          "parentId": null,
          "sourceS3Key": "",
          "type": "file",
          "userId": "000000000000000000000001",
          "workspaceId": "000000000000000000000002",
        },
        Object {
          "_id": "mock-4",
          "hash": "init",
          "name": "App.tsx",
          "parentId": "mock-6",
          "sourceS3Key": "",
          "type": "file",
          "userId": "000000000000000000000001",
          "workspaceId": "000000000000000000000002",
        },
        Object {
          "_id": "mock-7",
          "hash": "init",
          "name": "Button.tsx",
          "parentId": "mock-8",
          "sourceS3Key": "",
          "type": "file",
          "userId": "000000000000000000000001",
          "workspaceId": "000000000000000000000002",
        },
        Object {
          "_id": "mock-5",
          "hash": "init",
          "name": "components",
          "parentId": null,
          "type": "directory",
          "userId": "000000000000000000000001",
          "workspaceId": "000000000000000000000002",
        },
        Object {
          "_id": "mock-6",
          "hash": "init",
          "name": "main",
          "parentId": "mock-5",
          "type": "directory",
          "userId": "000000000000000000000001",
          "workspaceId": "000000000000000000000002",
        },
        Object {
          "_id": "mock-8",
          "hash": "init",
          "name": "foo",
          "parentId": "mock-6",
          "type": "directory",
          "userId": "000000000000000000000001",
          "workspaceId": "000000000000000000000002",
        },
      ]
    `);
  });
});
