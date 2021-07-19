import { gql } from 'apollo-server';
import { UserCollection } from '../../src/collections/User';
import { getNotificationSettings } from '../../src/contracts/user/getNotificationSettings';
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
        notificationSettings: {
          newsletter: false,
        },
      },
    }
  );
});

it('should return create notification settings if not exists', async () => {
  const ret = await getNotificationSettings(await getAppUser(1));
  expect(ret).toMatchInlineSnapshot(`
Object {
  "newsletter": true,
}
`);
});

it('should return return existing notification settings', async () => {
  const ret = await getNotificationSettings(await getAppUser(2));
  expect(ret).toMatchInlineSnapshot(`
Object {
  "newsletter": false,
}
`);
});

it('should return return existing notification settings #graphql', async () => {
  const res = await apolloServer.executeOperation(
    {
      query: gql`
        query {
          getNotificationSettings {
            newsletter
          }
        }
      `,
    },
    getTokenOptions('user1_token')
  );
  expect(res.errors).toBeFalsy();
  expect(res.data).toMatchInlineSnapshot(`
Object {
  "getNotificationSettings": Object {
    "newsletter": true,
  },
}
`);
});
