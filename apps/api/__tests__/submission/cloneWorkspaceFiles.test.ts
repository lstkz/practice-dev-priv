import { SubmissionStatus, WorkspaceNodeType } from 'shared';
import { SubmissionCollection } from '../../src/collections/Submission';
import { cloneWorkspaceFiles } from '../../src/contracts/submission/cloneWorkspaceFiles';
import { s3, sts } from '../../src/lib';
import { getId, setupDb } from '../helper';
import { registerSampleUsers } from '../seed-data';

let mocked_copyObject: jest.Mock<any, []> = null!;

setupDb();

beforeEach(async () => {
  await registerSampleUsers();
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
          parentId: null,
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
      libraries: [],
    },
  ]);
});

it('should clone files', async () => {
  await cloneWorkspaceFiles(getId(100));
  const submission = await SubmissionCollection.findByIdOrThrow(getId(100));
  expect(submission.nodes).toMatchInlineSnapshot(`
Array [
  Object {
    "_id": "1",
    "hash": "h1",
    "name": "1.txt",
    "parentId": null,
    "s3Key": "cdn/submission/000000000000000000000100/1",
    "sourceS3Key": "s1",
    "type": "file",
  },
  Object {
    "_id": "2",
    "hash": "h2",
    "name": "2.txt",
    "parentId": null,
    "s3Key": "copied-s2",
    "sourceS3Key": "s2",
    "type": "file",
  },
  Object {
    "_id": "3",
    "hash": "h2",
    "name": "3",
    "parentId": null,
    "type": "directory",
  },
]
`);
});
