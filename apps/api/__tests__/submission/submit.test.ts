import { gql } from 'apollo-server';
import * as R from 'remeda';
import { mocked } from 'ts-jest/utils';
import { SubmissionCollection } from '../../src/collections/Submission';
import { submit } from '../../src/contracts/submission/submit';
import { dispatchTask } from '../../src/dispatch';
import { apolloServer } from '../../src/server';
import { getAppUser, getId, getTokenOptions, setupDb } from '../helper';
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
    submit(await getAppUser(1), {
      workspaceId: getId(1000),
      indexHtmlS3Key: 'html',
    })
  ).rejects.toMatchInlineSnapshot(`[AppError: Workspace not found]`);
});

it('should throw if not permission', async () => {
  await expect(
    submit(await getAppUser(2), {
      workspaceId: getId(10),
      indexHtmlS3Key: 'html',
    })
  ).rejects.toMatchInlineSnapshot(
    `[ForbiddenError: Not permission to access this workspace]`
  );
});

it('should submit successfully', async () => {
  await submit(await getAppUser(1), {
    workspaceId: getId(10),
    indexHtmlS3Key: 'html',
  });
  const submission = await SubmissionCollection.findOne({});
  expect(R.omit(submission!, ['_id', 'notifyKey'])).toMatchInlineSnapshot(`
Object {
  "challengeUniqId": "1_2",
  "createdAt": 1970-01-01T00:00:00.001Z,
  "indexHtmlS3Key": "html",
  "nodes": Array [
    Object {
      "_id": "00000000-0000-4000-8000-000000000001",
      "name": "index.tsx",
      "parentId": null,
      "s3Key": null,
      "sourceS3Key": "s1",
      "type": "file",
    },
    Object {
      "_id": "00000000-0000-4000-8000-000000000002",
      "name": "components",
      "parentId": null,
      "s3Key": null,
      "sourceS3Key": null,
      "type": "directory",
    },
    Object {
      "_id": "00000000-0000-4000-8000-000000000003",
      "name": "forms",
      "parentId": "00000000-0000-4000-8000-000000000002",
      "s3Key": null,
      "sourceS3Key": null,
      "type": "directory",
    },
    Object {
      "_id": "00000000-0000-4000-8000-000000000004",
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

it('should submit #graphql', async () => {
  const res = await apolloServer.executeOperation(
    {
      query: gql`
        mutation ($values: SubmitInput!) {
          submit(values: $values)
        }
      `,
      variables: {
        values: {
          indexHtmlS3Key: 'html',
          workspaceId: getId(10).toHexString(),
        },
      },
    },
    getTokenOptions('user1_token')
  );
  expect(res.errors).toBeFalsy();
});
