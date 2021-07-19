import { getAppUser, setupDb } from '../helper';
import { login } from '../../src/contracts/user/login';
import { registerSampleUsers } from '../seed-data';
import { changeUsername } from '../../src/contracts/user/changeUsername';

setupDb();

beforeEach(async () => {
  await registerSampleUsers();
});

it('should be able to log in after changing the username #integration', async () => {
  await changeUsername(await getAppUser(1), 'FooBar');
  let ret = await login({ usernameOrEmail: 'FooBar', password: 'password1' });
  expect(ret.user.username).toEqual('FooBar');
  ret = await login({ usernameOrEmail: 'Foobar', password: 'password1' });
  expect(ret.user.username).toEqual('FooBar');
});
