import { execContract, setupDb } from '../helper';
import { registerSampleUsers } from '../seed-data';
import { login } from '../../src/contracts/user/login';
import { changePassword } from '../../src/contracts/user/changePassword';

setupDb();

beforeEach(async () => {
  await registerSampleUsers();
});

it('change password and log in with a new password', async () => {
  await execContract(changePassword, { password: 'new_pass' }, 'user1_token');
  const ret = await login({
    usernameOrEmail: 'user1',
    password: 'new_pass',
  });
  expect(ret.user.username).toEqual('user1');
});
