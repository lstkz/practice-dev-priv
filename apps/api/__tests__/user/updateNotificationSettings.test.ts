import { gql } from 'apollo-server';
import { UserCollection } from '../../src/collections/User';
import { updateNotificationSettings } from '../../src/contracts/user/updateNotificationSettings';
import { apolloServer } from '../../src/server';
import { getAppUser, getId, getTokenOptions, setupDb } from '../helper';
import { registerSampleUsers } from '../seed-data';

setupDb();

beforeEach(async () => {
  await registerSampleUsers();
});

it('should update notification settings', async () => {
  const ret = await updateNotificationSettings(await getAppUser(1), {
    newsletter: true,
  });
  expect(ret).toMatchInlineSnapshot(`
Object {
  "newsletter": true,
}
`);

  const user = await UserCollection.findByIdOrThrow(getId(1));
  expect(user.notificationSettings).toEqual({
    newsletter: true,
  });
});

it('should update notification settings #graphql', async () => {
  const res = await apolloServer.executeOperation(
    {
      query: gql`
        mutation {
          updateNotificationSettings(values: { newsletter: false }) {
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
  "updateNotificationSettings": Object {
    "newsletter": false,
  },
}
`);
});
