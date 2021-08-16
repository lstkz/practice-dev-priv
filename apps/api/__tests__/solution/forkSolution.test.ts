import { SubmissionStatus, WorkspaceNodeType } from 'shared';
import { SubmissionCollection } from '../../src/collections/Submission';
import { WorkspaceCollection } from '../../src/collections/Workspace';
import { execContract, getId, setupDb } from '../helper';
import {
  createSampleChallenges,
  createSampleWorkspaceItems,
  createSampleWorkspaces,
  registerSampleUsers,
} from '../seed-data';
import { s3, sts } from '../../src/lib';
import { SolutionCollection } from '../../src/collections/Solution';
import { forkSolution } from '../../src/contracts/solution/forkSolution';

setupDb();

let next = 1;

jest.mock('uuid', () => {
  return {
    v4: () => `mock-${next++}`,
  };
});

beforeEach(async () => {
  next = 1;
  await registerSampleUsers();
  await createSampleChallenges();
  await createSampleWorkspaces();
  await createSampleWorkspaceItems();
  await SubmissionCollection.insertMany([
    {
      _id: getId(100),
      challengeId: '1_2',
      createdAt: new Date(1),
      indexHtmlS3Key: 'index',
      isCloned: true,
      nodes: [
        {
          _id: '1',
          name: '1.txt',
          parentId: null,
          type: WorkspaceNodeType.File,
          sourceS3Key: 's1',
          s3Key: 'file-key',
          hash: 'h1',
        },
      ],
      notifyKey: '123',
      status: SubmissionStatus.Pass,
      userId: getId(1),
      workspaceId: getId(10),
      libraries: [],
    },
  ]);
  await SolutionCollection.insertMany([
    {
      _id: getId(200),
      challengeId: '1',
      createdAt: new Date(2),
      score: 1,
      submissionId: getId(100),
      title: 'sol',
      userId: getId(1),
    },
  ]);

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
  s3.copyObject = jest.fn(
    () =>
      ({
        promise: async () => ({}),
      } as any)
  );
});

it('should throw if solution not found', async () => {
  await expect(
    execContract(
      forkSolution,
      {
        workspaceId: getId(10),
        solutionId: getId(2000),
      },

      'user1_token'
    )
  ).rejects.toMatchInlineSnapshot(`[AppError: Solution not found]`);
});

it('should throw if workspace not found', async () => {
  await expect(
    execContract(
      forkSolution,
      {
        workspaceId: getId(1000),
        solutionId: getId(200),
      },

      'user1_token'
    )
  ).rejects.toMatchInlineSnapshot(`[AppError: Workspace not found]`);
});

it('should throw if not permission to workspace', async () => {
  await WorkspaceCollection.findOneAndUpdate(
    {
      _id: getId(10),
    },
    {
      $set: {
        userId: getId(2),
      },
    }
  );
  await expect(
    execContract(
      forkSolution,
      {
        workspaceId: getId(10),
        solutionId: getId(200),
      },

      'user1_token'
    )
  ).rejects.toMatchInlineSnapshot(`[Error: No access to workspace]`);
});

it('should fork solution', async () => {
  expect(
    await execContract(
      forkSolution,
      {
        workspaceId: getId(10),
        solutionId: getId(200),
      },

      'user1_token'
    )
  ).toMatchInlineSnapshot(`
    Object {
      "id": "000000000000000000000010",
      "items": Array [
        Object {
          "hash": "init",
          "id": "mock-1",
          "isLocked": null,
          "name": "1.txt",
          "parentId": null,
          "s3Key": "cdn/workspace/000000000000000000000010/mock-1",
          "sourceS3Key": "file-key",
          "type": "file",
          "uniqueKey": "000000000000000000000010__file_1.txt",
          "userId": "000000000000000000000001",
          "workspaceId": "000000000000000000000010",
        },
      ],
      "libraries": Array [],
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
