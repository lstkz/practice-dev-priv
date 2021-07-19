import { gql } from 'apollo-server';
import { UserCollection } from '../../src/collections/User';
import { getMyProfile } from '../../src/contracts/user/getMyProfile';
import { apolloServer } from '../../src/server';
import { getAppUser, getId, getTokenOptions, setupDb } from '../helper';
import { registerSampleUsers } from '../seed-data';

setupDb();

beforeEach(async () => {
  await registerSampleUsers();
  await UserCollection.updateOne(
    {
      _id: getId(2),
    },
    {
      $set: {
        profile: {
          about: 'about field',
          country: 'PL',
          name: 'John',
          url: 'http://example.org',
        },
      },
    }
  );
});

it('should return an empty profile if is not set', async () => {
  const ret = await getMyProfile(await getAppUser(1));
  expect(ret).toMatchInlineSnapshot(`Object {}`);
});

it('should return a profile', async () => {
  const ret = await getMyProfile(await getAppUser(2));
  expect(ret).toMatchInlineSnapshot(`
Object {
  "about": "about field",
  "country": "PL",
  "name": "John",
  "url": "http://example.org",
}
`);
});

it('should return a profile #graphql', async () => {
  const res = await apolloServer.executeOperation(
    {
      query: gql`
        query {
          getMyProfile {
            about
            country
            url
            name
          }
        }
      `,
    },
    getTokenOptions('user2_token')
  );
  expect(res.errors).toBeFalsy();
  expect(res.data).toMatchInlineSnapshot(`
Object {
  "getMyProfile": Object {
    "about": "about field",
    "country": "PL",
    "name": "John",
    "url": "http://example.org",
  },
}
`);
});
