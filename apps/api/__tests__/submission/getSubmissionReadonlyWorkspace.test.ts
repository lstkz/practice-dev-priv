import { SubmissionStatus, WorkspaceNodeType } from 'shared';
import { SubmissionCollection } from '../../src/collections/Submission';
import { getSubmissionReadonlyWorkspace } from '../../src/contracts/submission/getSubmissionReadonlyWorkspace';
import { execContract, getId, setupDb } from '../helper';
import { registerSampleUsers } from '../seed-data';

setupDb();

jest.mock('uuid', () => {
  let next = 1;
  return {
    v4: () => `mock-${next++}`,
  };
});

beforeEach(async () => {
  await registerSampleUsers();
  await SubmissionCollection.insertMany([
    {
      _id: getId(100),
      challengeId: '1',
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
          s3Key: null,
          hash: 'h1',
        },
        {
          _id: '2',
          name: '2.txt',
          parentId: '3',
          type: WorkspaceNodeType.File,
          sourceS3Key: 's2',
          s3Key: 'copied-s2',
          hash: 'h2',
        },
        {
          _id: '3',
          name: '3',
          parentId: null,
          type: WorkspaceNodeType.Directory,
          hash: 'h2',
        },
      ],
      notifyKey: '123',
      status: SubmissionStatus.Queued,
      userId: getId(1),
      workspaceId: getId(10),
      libraries: [
        {
          name: 'lib1',
          source: 's1',
          types: 't1',
        },
      ],
    },
  ]);
});

it('should throw if submission not found', async () => {
  await expect(
    execContract(
      getSubmissionReadonlyWorkspace,
      {
        id: getId(112345),
      },

      'user1_token'
    )
  ).rejects.toMatchInlineSnapshot(`[AppError: Submission not found]`);
});

it('should throw if no permission', async () => {
  await expect(
    execContract(
      getSubmissionReadonlyWorkspace,
      {
        id: getId(100),
      },

      'user2_token'
    )
  ).rejects.toMatchInlineSnapshot(`[Error: No access to this submission]`);
});

it('should return the readonly workspace', async () => {
  await expect(
    await execContract(
      getSubmissionReadonlyWorkspace,
      {
        id: getId(100),
      },

      'user1_token'
    )
  ).toMatchInlineSnapshot(`
          Object {
            "id": "000000000000000000000100",
            "items": Array [
              Object {
                "hash": "init",
                "id": "1",
                "name": "1.txt",
                "parentId": null,
                "type": "file",
              },
              Object {
                "hash": "init",
                "id": "2",
                "name": "2.txt",
                "parentId": "3",
                "type": "file",
              },
              Object {
                "hash": "init",
                "id": "3",
                "name": "3",
                "parentId": null,
                "type": "directory",
              },
            ],
            "libraries": Array [
              Object {
                "name": "lib1",
                "source": "s1",
                "types": "t1",
              },
            ],
          }
        `);
});
