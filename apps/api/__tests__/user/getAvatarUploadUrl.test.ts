import { gql } from 'apollo-server';
import { s3 } from '../../src/lib';
import { apolloServer } from '../../src/server';
import { getTokenOptions, setupDb } from '../helper';
import { registerSampleUsers } from '../seed-data';

setupDb();

beforeEach(async () => {
  await registerSampleUsers();
});

it('should return a profile #graphql', async () => {
  s3.createPresignedPost = () => ({
    url: '/foo',
    fields: {
      'Content-Type': 'image/png',
      foo: 'bar',
    } as any,
  });
  const res = await apolloServer.executeOperation(
    {
      query: gql`
        query {
          getAvatarUploadUrl {
            url
            fields {
              name
              value
            }
          }
        }
      `,
    },
    getTokenOptions('user1_token')
  );
  expect(res.errors).toBeFalsy();
  expect(res.data).toMatchInlineSnapshot(`
Object {
  "getAvatarUploadUrl": Object {
    "fields": Array [
      Object {
        "name": "Content-Type",
        "value": "image/png",
      },
      Object {
        "name": "foo",
        "value": "bar",
      },
    ],
    "url": "/foo",
  },
}
`);
});
