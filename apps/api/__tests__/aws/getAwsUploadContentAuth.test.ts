import { gql } from 'apollo-server';
import { apolloServer } from '../../src/server';
import { getTokenOptions, setupDb } from '../helper';
import { registerSampleUsers } from '../seed-data';

setupDb();

beforeEach(async () => {
  await registerSampleUsers();
});

it('should throw if not admin #graphql', async () => {
  const res = await apolloServer.executeOperation(
    {
      query: gql`
        query {
          getAwsUploadContentAuth {
            bucketName
            credentials {
              accessKeyId
              secretAccessKey
              sessionToken
            }
          }
        }
      `,
    },
    getTokenOptions('user1_token')
  );
  expect(res.errors).toMatchInlineSnapshot(`
Array [
  Object {
    "extensions": Object {
      "code": "FORBIDDEN",
    },
    "locations": Array [
      Object {
        "column": 3,
        "line": 2,
      },
    ],
    "message": "No permission",
    "path": Array [
      "getAwsUploadContentAuth",
    ],
  },
]
`);
});
