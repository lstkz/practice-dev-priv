import { gql } from 'apollo-server';
import { apolloServer } from '../../src/server';
import { getTokenOptions, setupDb } from '../helper';
import { registerSampleUsers } from '../seed-data';

setupDb();

beforeEach(async () => {
  await registerSampleUsers();
});

it('should return user #graphql', async () => {
  const res = await apolloServer.executeOperation(
    {
      query: gql`
        query {
          me {
            username
            email
          }
        }
      `,
    },
    getTokenOptions('user1_token')
  );
  expect(res.data).toMatchInlineSnapshot(`
Object {
  "me": Object {
    "email": "user1@example.com",
    "username": "user1",
  },
}
`);
  expect(res.errors).toBeFalsy();
});

it('should return error if missing token #graphql', async () => {
  const res = await apolloServer.executeOperation({
    query: gql`
      query {
        me {
          username
          email
        }
      }
    `,
  });
  expect(res.errors).toMatchInlineSnapshot(`
Array [
  Object {
    "extensions": Object {
      "code": "UNAUTHENTICATED",
    },
    "locations": Array [
      Object {
        "column": 3,
        "line": 2,
      },
    ],
    "message": "Access token required",
    "path": Array [
      "me",
    ],
  },
]
`);
});

it('should return error if token invalid #graphql', async () => {
  await expect(
    apolloServer.executeOperation(
      {
        query: gql`
          query {
            me {
              username
              email
            }
          }
        `,
      },

      getTokenOptions('asdsad')
    )
  ).rejects.toThrowErrorMatchingInlineSnapshot(`"Invalid access token"`);
});
