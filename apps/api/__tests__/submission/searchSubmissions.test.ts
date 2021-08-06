import { SubmissionStatus } from 'shared';
import { gql } from 'apollo-server';
import {
  SubmissionCollection,
  SubmissionModel,
} from '../../src/collections/Submission';
import { apolloServer } from '../../src/server';
import { searchSubmissions } from '../../src/contracts/submission/searchSubmissions';
import { getAppUser, getId, getTokenOptions, setupDb } from '../helper';
import { registerSampleUsers } from '../seed-data';
import { SubmissionSortBy } from '../../src/generated';

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
    await searchSubmissions(await getAppUser(1), {
      offset: 0,
      limit: 10,
      sortBy: SubmissionSortBy.Newest,
    })
  ).toMatchInlineSnapshot(`
    Object {
      "items": Array [
        Object {
          "createdAt": "1970-01-01T00:00:00.003Z",
          "id": "000000000000000000000102",
          "nodes": Array [],
          "status": "Fail",
        },
        Object {
          "createdAt": "1970-01-01T00:00:00.002Z",
          "id": "000000000000000000000101",
          "nodes": Array [],
          "status": "Pass",
        },
        Object {
          "createdAt": "1970-01-01T00:00:00.001Z",
          "id": "000000000000000000000100",
          "nodes": Array [],
          "status": "Pass",
        },
      ],
      "total": 3,
    }
  `);
});

it('should return results by oldest', async () => {
  expect(
    await searchSubmissions(await getAppUser(1), {
      offset: 0,
      limit: 10,
      sortBy: SubmissionSortBy.Oldest,
    })
  ).toMatchInlineSnapshot(`
    Object {
      "items": Array [
        Object {
          "createdAt": "1970-01-01T00:00:00.001Z",
          "id": "000000000000000000000100",
          "nodes": Array [],
          "status": "Pass",
        },
        Object {
          "createdAt": "1970-01-01T00:00:00.002Z",
          "id": "000000000000000000000101",
          "nodes": Array [],
          "status": "Pass",
        },
        Object {
          "createdAt": "1970-01-01T00:00:00.003Z",
          "id": "000000000000000000000102",
          "nodes": Array [],
          "status": "Fail",
        },
      ],
      "total": 3,
    }
  `);
});

it('should return results by oldest with offset', async () => {
  expect(
    await searchSubmissions(await getAppUser(1), {
      offset: 1,
      limit: 10,
      sortBy: SubmissionSortBy.Oldest,
    })
  ).toMatchInlineSnapshot(`
    Object {
      "items": Array [
        Object {
          "createdAt": "1970-01-01T00:00:00.002Z",
          "id": "000000000000000000000101",
          "nodes": Array [],
          "status": "Pass",
        },
        Object {
          "createdAt": "1970-01-01T00:00:00.003Z",
          "id": "000000000000000000000102",
          "nodes": Array [],
          "status": "Fail",
        },
      ],
      "total": 3,
    }
  `);
});

it('should return results by oldest with limit', async () => {
  expect(
    await searchSubmissions(await getAppUser(1), {
      offset: 0,
      limit: 2,
      sortBy: SubmissionSortBy.Oldest,
    })
  ).toMatchInlineSnapshot(`
    Object {
      "items": Array [
        Object {
          "createdAt": "1970-01-01T00:00:00.001Z",
          "id": "000000000000000000000100",
          "nodes": Array [],
          "status": "Pass",
        },
        Object {
          "createdAt": "1970-01-01T00:00:00.002Z",
          "id": "000000000000000000000101",
          "nodes": Array [],
          "status": "Pass",
        },
      ],
      "total": 3,
    }
  `);
});

it('should search #graphql', async () => {
  const res = await apolloServer.executeOperation(
    {
      query: gql`
        query {
          searchSubmissions(
            criteria: { limit: 10, offset: 0, sortBy: newest }
          ) {
            items {
              id
            }
            total
          }
        }
      `,
    },
    getTokenOptions('user1_token')
  );
  expect(res.errors).toBeFalsy();
  expect(res.data).toMatchInlineSnapshot(`
    Object {
      "searchSubmissions": Object {
        "items": Array [
          Object {
            "id": "000000000000000000000102",
          },
          Object {
            "id": "000000000000000000000101",
          },
          Object {
            "id": "000000000000000000000100",
          },
        ],
        "total": 3,
      },
    }
  `);
});
