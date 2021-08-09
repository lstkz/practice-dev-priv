import { SubmissionSortBy, SubmissionStatus } from 'shared';
import {
  SubmissionCollection,
  SubmissionModel,
} from '../../src/collections/Submission';
import { searchSubmissions } from '../../src/contracts/submission/searchSubmissions';
import { execContract, getId, setupDb } from '../helper';
import { registerSampleUsers } from '../seed-data';

setupDb();

beforeEach(async () => {
  await registerSampleUsers();
  const defaultValues: SubmissionModel = {
    _id: getId(100),
    challengeUniqId: '1_1',
    createdAt: new Date(0),
    indexHtmlS3Key: 'index',
    nodes: [],
    notifyKey: '123',
    status: SubmissionStatus.Fail,
    userId: getId(1),
    workspaceId: getId(10),
    testRun: null,
    libraries: [],
  };
  await SubmissionCollection.insertMany([
    {
      ...defaultValues,
      _id: getId(100),
      status: SubmissionStatus.Pass,
      createdAt: new Date(1),
      notifyKey: '1',
    },
    {
      ...defaultValues,
      _id: getId(101),
      status: SubmissionStatus.Pass,
      createdAt: new Date(2),
      notifyKey: '2',
    },
    {
      ...defaultValues,
      _id: getId(102),
      status: SubmissionStatus.Fail,
      createdAt: new Date(3),
      notifyKey: '3',
    },
    {
      ...defaultValues,
      _id: getId(103),
      status: SubmissionStatus.Fail,
      createdAt: new Date(4),
      userId: getId(3),
      notifyKey: '4',
    },
  ]);
});

it('should return results by newest', async () => {
  expect(
    await execContract(
      searchSubmissions,
      {
        criteria: {
          offset: 0,
          limit: 10,
          sortBy: SubmissionSortBy.Newest,
        },
      },

      'user1_token'
    )
  ).toMatchInlineSnapshot(`
    Object {
      "items": Array [
        Object {
          "createdAt": "1970-01-01T00:00:00.003Z",
          "id": "000000000000000000000102",
          "status": "fail",
        },
        Object {
          "createdAt": "1970-01-01T00:00:00.002Z",
          "id": "000000000000000000000101",
          "status": "pass",
        },
        Object {
          "createdAt": "1970-01-01T00:00:00.001Z",
          "id": "000000000000000000000100",
          "status": "pass",
        },
      ],
      "total": 3,
    }
  `);
});

it('should return results by oldest', async () => {
  expect(
    await execContract(
      searchSubmissions,
      {
        criteria: {
          offset: 0,
          limit: 10,
          sortBy: SubmissionSortBy.Oldest,
        },
      },

      'user1_token'
    )
  ).toMatchInlineSnapshot(`
    Object {
      "items": Array [
        Object {
          "createdAt": "1970-01-01T00:00:00.001Z",
          "id": "000000000000000000000100",
          "status": "pass",
        },
        Object {
          "createdAt": "1970-01-01T00:00:00.002Z",
          "id": "000000000000000000000101",
          "status": "pass",
        },
        Object {
          "createdAt": "1970-01-01T00:00:00.003Z",
          "id": "000000000000000000000102",
          "status": "fail",
        },
      ],
      "total": 3,
    }
  `);
});

it('should return results by oldest with offset', async () => {
  expect(
    await execContract(
      searchSubmissions,
      {
        criteria: {
          offset: 1,
          limit: 10,
          sortBy: SubmissionSortBy.Oldest,
        },
      },

      'user1_token'
    )
  ).toMatchInlineSnapshot(`
    Object {
      "items": Array [
        Object {
          "createdAt": "1970-01-01T00:00:00.002Z",
          "id": "000000000000000000000101",
          "status": "pass",
        },
        Object {
          "createdAt": "1970-01-01T00:00:00.003Z",
          "id": "000000000000000000000102",
          "status": "fail",
        },
      ],
      "total": 3,
    }
  `);
});

it('should return results by oldest with limit', async () => {
  expect(
    await execContract(
      searchSubmissions,
      {
        criteria: {
          offset: 0,
          limit: 2,
          sortBy: SubmissionSortBy.Oldest,
        },
      },

      'user1_token'
    )
  ).toMatchInlineSnapshot(`
    Object {
      "items": Array [
        Object {
          "createdAt": "1970-01-01T00:00:00.001Z",
          "id": "000000000000000000000100",
          "status": "pass",
        },
        Object {
          "createdAt": "1970-01-01T00:00:00.002Z",
          "id": "000000000000000000000101",
          "status": "pass",
        },
      ],
      "total": 3,
    }
  `);
});
