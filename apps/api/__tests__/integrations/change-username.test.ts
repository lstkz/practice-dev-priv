import { execContract, setupDb } from '../helper';
import { login } from '../../src/contracts/user/login';
import { registerSampleUsers } from '../seed-data';
import { changeUsername } from '../../src/contracts/user/changeUsername';

setupDb();

beforeEach(async () => {
  await registerSampleUsers();
});

it('should be able to log in after changing the username #integration', async () => {
  await execContract(changeUsername, { username: 'FooBar' }, 'user1_token');
  let ret = await execContract(login, {
    values: {
      usernameOrEmail: 'FooBar',
      password: 'password1',
    },
  });
  expect(ret.user.username).toEqual('FooBar');
  ret = await execContract(login, {
    values: {
      usernameOrEmail: 'Foobar',
      password: 'password1',
    },
  });
  expect(ret.user.username).toEqual('FooBar');
});
