import { UserCollection } from '../../src/collections/User';
import { getNotificationSettings } from '../../src/contracts/user/getNotificationSettings';
import { execContract, getId, setupDb } from '../helper';
import { registerSampleUsers } from '../seed-data';

jest.mock('../../src/dispatch');

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
          newsletter: true,
        },
      },
    }
  );
});

it('should return create notification settings if not exists', async () => {
  const ret = await execContract(getNotificationSettings, {}, 'user1_token');
  expect(ret).toMatchInlineSnapshot(`
Object {
  "newsletter": false,
}
`);
});

it('should return return existing notification settings', async () => {
  const ret = await execContract(getNotificationSettings, {}, 'user2_token');
  expect(ret).toMatchInlineSnapshot(`
Object {
  "newsletter": true,
}
`);
});
