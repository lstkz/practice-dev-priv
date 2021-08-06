import { getMe } from '../../src/contracts/user/getMe';
import { execContract, setupDb } from '../helper';
import { registerSampleUsers } from '../seed-data';

setupDb();

beforeEach(async () => {
  await registerSampleUsers();
});

it('should return user', async () => {
  expect(await execContract(getMe, {}, 'user1_token')).toMatchInlineSnapshot(`
Object {
  "avatarId": undefined,
  "email": "user1@example.com",
  "id": "000000000000000000000001",
  "isAdmin": undefined,
  "isVerified": true,
  "username": "user1",
}
`);
});
