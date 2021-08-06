import { UserCollection } from '../../src/collections/User';
import { updateNotificationSettings } from '../../src/contracts/user/updateNotificationSettings';
import { execContract, getId, setupDb } from '../helper';
import { registerSampleUsers } from '../seed-data';

setupDb();

beforeEach(async () => {
  await registerSampleUsers();
});

it('should update notification settings', async () => {
  const ret = await execContract(
    updateNotificationSettings,
    { values: { newsletter: true } },
    'user1_token'
  );
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
