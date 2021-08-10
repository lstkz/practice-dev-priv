import { WorkspaceNodeType } from 'shared';
import {
  createWorkspaceNodes,
  createWorkspaceNodesFromSubmission,
} from '../../src/common/workspace-tree';
import { getId } from '../helper';

let next = 1;
jest.mock('uuid', () => {
  return {
    v4: () => `mock-${next++}`,
  };
});

beforeEach(() => {
  next = 1;
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
          "isLocked": undefined,
          "name": "index.tsx",
          "parentId": null,
          "sourceS3Key": "s3key-index",
          "type": "file",
          "uniqueKey": "000000000000000000000002__file_index.tsx",
          "userId": "000000000000000000000001",
          "workspaceId": "000000000000000000000002",
        },
        Object {
          "_id": "mock-2",
          "hash": "init",
          "isLocked": undefined,
          "name": "App.tsx",
          "parentId": null,
          "sourceS3Key": "s3key-app",
          "type": "file",
          "uniqueKey": "000000000000000000000002__file_app.tsx",
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
          "_id": "mock-1",
          "hash": "init",
          "isLocked": undefined,
          "name": "index.tsx",
          "parentId": null,
          "sourceS3Key": "",
          "type": "file",
          "uniqueKey": "000000000000000000000002__file_index.tsx",
          "userId": "000000000000000000000001",
          "workspaceId": "000000000000000000000002",
        },
        Object {
          "_id": "mock-2",
          "hash": "init",
          "isLocked": undefined,
          "name": "App.tsx",
          "parentId": "mock-4",
          "sourceS3Key": "",
          "type": "file",
          "uniqueKey": "000000000000000000000002_mock-4_file_app.tsx",
          "userId": "000000000000000000000001",
          "workspaceId": "000000000000000000000002",
        },
        Object {
          "_id": "mock-5",
          "hash": "init",
          "isLocked": undefined,
          "name": "Button.tsx",
          "parentId": "mock-6",
          "sourceS3Key": "",
          "type": "file",
          "uniqueKey": "000000000000000000000002_mock-6_file_button.tsx",
          "userId": "000000000000000000000001",
          "workspaceId": "000000000000000000000002",
        },
        Object {
          "_id": "mock-3",
          "hash": "init",
          "name": "components",
          "parentId": null,
          "type": "directory",
          "uniqueKey": "000000000000000000000002__directory_components",
          "userId": "000000000000000000000001",
          "workspaceId": "000000000000000000000002",
        },
        Object {
          "_id": "mock-4",
          "hash": "init",
          "name": "main",
          "parentId": "mock-3",
          "type": "directory",
          "uniqueKey": "000000000000000000000002_mock-3_directory_main",
          "userId": "000000000000000000000001",
          "workspaceId": "000000000000000000000002",
        },
        Object {
          "_id": "mock-6",
          "hash": "init",
          "name": "foo",
          "parentId": "mock-4",
          "type": "directory",
          "uniqueKey": "000000000000000000000002_mock-4_directory_foo",
          "userId": "000000000000000000000001",
          "workspaceId": "000000000000000000000002",
        },
      ]
    `);
  });
});

describe('createWorkspaceNodesFromSubmission', () => {
  it('should create nodes', () => {
    expect(
      createWorkspaceNodesFromSubmission(
        {
          userId: getId(1),
          workspaceId: getId(2),
        },

        [
          {
            directory: './d1/d2',
            name: 'f2.ts',
            s3Key: '',
          },

          {
            directory: './d1/d2',
            name: 'f3.ts',
            s3Key: '',
            isLocked: true,
          },
        ],

        [
          {
            _id: 'f1',
            name: 'f1.ts',
            hash: '',
            parentId: null,
            type: WorkspaceNodeType.File,
            s3Key: 'f1_key',
          },

          {
            _id: 'd1',
            name: 'd1',
            hash: '',
            parentId: null,
            type: WorkspaceNodeType.Directory,
          },

          {
            _id: 'd2',
            name: 'd2',
            hash: '',
            parentId: 'd1',
            type: WorkspaceNodeType.Directory,
          },

          {
            _id: 'f2',
            name: 'f2.ts',
            hash: '',
            parentId: 'd2',
            type: WorkspaceNodeType.File,
            s3Key: 'f2_key',
          },

          {
            _id: 'f3',
            name: 'f3.ts',
            hash: '',
            parentId: 'd2',
            type: WorkspaceNodeType.File,
            s3Key: 'f3_key',
          },
        ]
      )
    ).toMatchInlineSnapshot(`
      Array [
        Object {
          "_id": "mock-1",
          "hash": "init",
          "isLocked": undefined,
          "name": "f1.ts",
          "parentId": null,
          "sourceS3Key": "f1_key",
          "type": "file",
          "uniqueKey": "000000000000000000000002__file_f1.ts",
          "userId": "000000000000000000000001",
          "workspaceId": "000000000000000000000002",
        },
        Object {
          "_id": "mock-2",
          "hash": "init",
          "isLocked": undefined,
          "name": "f2.ts",
          "parentId": "mock-4",
          "sourceS3Key": "f2_key",
          "type": "file",
          "uniqueKey": "000000000000000000000002_mock-4_file_f2.ts",
          "userId": "000000000000000000000001",
          "workspaceId": "000000000000000000000002",
        },
        Object {
          "_id": "mock-5",
          "hash": "init",
          "isLocked": true,
          "name": "f3.ts",
          "parentId": "mock-4",
          "sourceS3Key": "f3_key",
          "type": "file",
          "uniqueKey": "000000000000000000000002_mock-4_file_f3.ts",
          "userId": "000000000000000000000001",
          "workspaceId": "000000000000000000000002",
        },
        Object {
          "_id": "mock-3",
          "hash": "init",
          "name": "d1",
          "parentId": null,
          "type": "directory",
          "uniqueKey": "000000000000000000000002__directory_d1",
          "userId": "000000000000000000000001",
          "workspaceId": "000000000000000000000002",
        },
        Object {
          "_id": "mock-4",
          "hash": "init",
          "name": "d2",
          "parentId": "mock-3",
          "type": "directory",
          "uniqueKey": "000000000000000000000002_mock-3_directory_d2",
          "userId": "000000000000000000000001",
          "workspaceId": "000000000000000000000002",
        },
      ]
    `);
  });
});
