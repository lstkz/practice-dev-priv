import { ActivityCollection } from '../../src/collections/Activity';
import { activityOnUserRegistered } from '../../src/contracts/activity/activityOnUserRegistered';
import { getId, setupDb } from '../helper';

setupDb();

it('should add an activity', async () => {
  Date.now = () => 1;
  await activityOnUserRegistered(getId(1));
  const activity = await ActivityCollection.findOne({});
  expect(activity).toMatchInlineSnapshot(`
Object {
  "_id": <Random ObjectID>,
  "createdAt": 1970-01-01T00:00:00.001Z,
  "data": Object {
    "type": "registered",
  },
  "userId": "000000000000000000000001",
}
`);
});
