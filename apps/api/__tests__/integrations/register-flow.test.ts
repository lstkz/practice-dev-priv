import { mocked } from 'ts-jest/utils';
import { confirmEmail } from '../../src/contracts/user/confirmEmail';
import { setupDb } from '../helper';
import { register } from '../../src/contracts/user/register';
import { sendMailjetEmail } from '../../src/common/mailjet';
import { login } from '../../src/contracts/user/login';

jest.mock('../../src/common/mailjet');

const mocked_sendMailjetEmail = mocked(sendMailjetEmail);

setupDb();

it('should register user and verify account #integration', async () => {
  let ret = await register({
    email: 'user1@example.com',
    username: 'user1',
    password: 'password',
  });
  expect(ret.user.isVerified).toEqual(false);
  expect(mocked_sendMailjetEmail).toBeCalled();
  const options = mocked_sendMailjetEmail.mock.calls[0][0];
  expect(options.template.type).toEqual('actionButton');
  const exec = /confirm-email=(.+)/.exec(options.template.variables.link_url);
  expect(exec).toBeDefined();
  const code = exec![1];
  await confirmEmail(code);
  ret = await login({
    usernameOrEmail: 'user1',
    password: 'password',
  });
  expect(ret.user.isVerified).toEqual(true);
});
