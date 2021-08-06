import { logout } from '../../src/contracts/user/logout';
import { execContract, setupDb } from '../helper';
import { registerSampleUsers } from '../seed-data';

setupDb();

beforeEach(async () => {
  await registerSampleUsers();
});

it('should return error if missing token', async () => {
  await execContract(logout, {}, 'user1_token');
  await expect(
    execContract(logout, {}, 'user1_token')
  ).rejects.toMatchInlineSnapshot(`[Error: invalid token]`);
});
