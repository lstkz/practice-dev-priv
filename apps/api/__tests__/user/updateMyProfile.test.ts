import { gql } from 'apollo-server';
import { getMyProfile } from '../../src/contracts/user/getMyProfile';
import { updateMyProfile } from '../../src/contracts/user/updateMyProfile';
import { apolloServer } from '../../src/server';
import { getAppUser, getTokenOptions, setupDb } from '../helper';
import { registerSampleUsers } from '../seed-data';

setupDb();

beforeEach(async () => {
  await registerSampleUsers();
});

it('should return an empty profile if is not set', async () => {
  const ret = await updateMyProfile(await getAppUser(1), {
    about: 'about field',
    country: 'PL',
    name: 'John',
    url: 'http://example.org',
  });
  expect(ret).toMatchInlineSnapshot(`
Object {
  "about": "about field",
  "country": "PL",
  "name": "John",
  "url": "http://example.org",
}
`);
  expect(ret).toEqual(await getMyProfile(await getAppUser(1)));
});

it('should return a profile #graphql', async () => {
  const res = await apolloServer.executeOperation(
    {
      query: gql`
        mutation {
          updateMyProfile(
            values: {
              about: "about field"
              country: "PL"
              name: "John"
              url: "http://example.org"
            }
          ) {
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
  "updateMyProfile": Object {
    "about": "about field",
    "country": "PL",
    "name": "John",
    "url": "http://example.org",
  },
}
`);
});
