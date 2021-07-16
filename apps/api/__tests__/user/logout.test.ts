import { gql } from 'apollo-server';
import { apolloServer } from '../../src/server';
import { getTokenOptions, setupDb } from '../helper';
import { registerSampleUsers } from '../seed-data';

setupDb();

beforeEach(async () => {
  await registerSampleUsers();
});

it('should return error if missing token #graphql', async () => {
  const res = await apolloServer.executeOperation(
    {
      query: gql`
        mutation {
          logout
        }
      `,
    },
    getTokenOptions('user1_token')
  );
  expect(res.errors).toBeFalsy();
  await expect(
    apolloServer.executeOperation(
      {
        query: gql`
          mutation {
            logout
          }
        `,
      },

      getTokenOptions('user1_token')
    )
  ).rejects.toMatchInlineSnapshot(
    `[AuthenticationError: Invalid access token]`
  );
});
