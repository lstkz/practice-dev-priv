import * as R from 'remeda';
import { mocked } from 'ts-jest/utils';
import { SubmissionCollection } from '../../src/collections/Submission';
import { submit } from '../../src/contracts/submission/submit';
import { dispatchTask } from '../../src/dispatch';
import { execContract, getId, setupDb } from '../helper';
import {
  createSampleChallenges,
  createSampleWorkspaceItems,
  createSampleWorkspaces,
  registerSampleUsers,
} from '../seed-data';

jest.mock('../../src/dispatch');

const mocked_dispatchTask = mocked(dispatchTask);

setupDb();

beforeEach(async () => {
  await registerSampleUsers();
  await createSampleChallenges();
  await createSampleWorkspaces();
  await createSampleWorkspaceItems();
  mocked_dispatchTask.mockClear();
  Date.now = () => 1;
});

it('should throw if workspace not found', async () => {
  await expect(
    execContract(
      submit,
      {
        values: {
          workspaceId: getId(1000),
          indexHtmlS3Key: 'html',
        },
      },
      'user1_token'
    )
  ).rejects.toMatchInlineSnapshot(`[AppError: Workspace not found]`);
});

it('should throw if not permission', async () => {
  await expect(
    execContract(
      submit,
      {
        values: {
          workspaceId: getId(10),
          indexHtmlS3Key: 'html',
        },
      },

      'user2_token'
    )
  ).rejects.toMatchInlineSnapshot(
    `[Error: Not permission to access this workspace]`
  );
});

it('should submit successfully', async () => {
  await execContract(
    submit,
    {
      values: {
        workspaceId: getId(10),
        indexHtmlS3Key: 'html',
      },
    },
    'user1_token'
  );
  const submission = await SubmissionCollection.findOne({});
  expect(R.omit(submission!, ['_id', 'notifyKey'])).toMatchInlineSnapshot(`
Object {
  "challengeId": "1_2",
  "createdAt": 1970-01-01T00:00:00.001Z,
  "indexHtmlS3Key": "html",
  "isCloned": false,
  "libraries": Array [],
  "nodes": Array [
    Object {
      "_id": "00000000-0000-4000-8000-000000000001",
      "hash": "123",
      "name": "index.tsx",
      "parentId": null,
      "s3Key": null,
      "sourceS3Key": "s1",
      "type": "file",
    },
    Object {
      "_id": "00000000-0000-4000-8000-000000000002",
      "hash": "123",
      "name": "components",
      "parentId": null,
      "s3Key": null,
      "sourceS3Key": null,
      "type": "directory",
    },
    Object {
      "_id": "00000000-0000-4000-8000-000000000003",
      "hash": "123",
      "name": "forms",
      "parentId": "00000000-0000-4000-8000-000000000002",
      "s3Key": null,
      "sourceS3Key": null,
      "type": "directory",
    },
    Object {
      "_id": "00000000-0000-4000-8000-000000000004",
      "hash": "123",
      "name": "Button.tsx",
      "parentId": "00000000-0000-4000-8000-000000000003",
      "s3Key": null,
      "sourceS3Key": "s2",
      "type": "file",
    },
  ],
  "status": "queued",
  "userId": "000000000000000000000001",
  "workspaceId": "000000000000000000000010",
}
`);
  expect(mocked_dispatchTask).toBeCalled();
});
