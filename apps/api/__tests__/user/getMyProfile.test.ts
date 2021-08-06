import { UserCollection } from '../../src/collections/User';
import { getMyProfile } from '../../src/contracts/user/getMyProfile';
import { execContract, getId, setupDb } from '../helper';
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
  const ret = await execContract(getMyProfile, {}, 'user1_token');
  expect(ret).toMatchInlineSnapshot(`Object {}`);
});

it('should return a profile', async () => {
  const ret = await execContract(getMyProfile, {}, 'user2_token');
  expect(ret).toMatchInlineSnapshot(`
Object {
  "about": "about field",
  "country": "PL",
  "name": "John",
  "url": "http://example.org",
}
`);
});
