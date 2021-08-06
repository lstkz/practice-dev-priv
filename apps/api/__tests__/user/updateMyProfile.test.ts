import { getMyProfile } from '../../src/contracts/user/getMyProfile';
import { updateMyProfile } from '../../src/contracts/user/updateMyProfile';
import { execContract, setupDb } from '../helper';
import { registerSampleUsers } from '../seed-data';

setupDb();

beforeEach(async () => {
  await registerSampleUsers();
});

it('should return an empty profile if is not set', async () => {
  const ret = await execContract(
    updateMyProfile,
    {
      values: {
        about: 'about field',
        country: 'PL',
        name: 'John',
        url: 'http://example.org',
      },
    },
    'user1_token'
  );

  expect(ret).toMatchInlineSnapshot(`
Object {
  "about": "about field",
  "country": "PL",
  "name": "John",
  "url": "http://example.org",
}
`);
  expect(ret).toEqual(await execContract(getMyProfile, {}, 'user1_token'));
});
