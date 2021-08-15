import { ActivityCollection } from '../../src/collections/Activity';
import { activityOnChallengeSolved } from '../../src/contracts/activity/activityOnChallengeSolved';
import { getId, setupDb } from '../helper';

setupDb();

it('should add an activity', async () => {
  Date.now = () => 1;
  await activityOnChallengeSolved({
    challengeId: '123',
    moduleId: 1,
    userId: getId(1),
  });
  const activity = await ActivityCollection.findOne({});
  expect(activity).toMatchInlineSnapshot(`
Object {
  "_id": <Random ObjectID>,
  "createdAt": 1970-01-01T00:00:00.001Z,
  "data": Object {
    "type": "challenge-solved",
    "values": Object {
      "challengeId": "123",
      "moduleId": 1,
    },
  },
  "userId": "000000000000000000000001",
}
`);
});
