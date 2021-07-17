import { mocked } from 'ts-jest/utils';
import { setupDb } from '../helper';
import { sendMailjetEmail } from '../../src/common/mailjet';
import { login } from '../../src/contracts/user/login';
import { resetPassword } from '../../src/contracts/user/resetPassword';
import { confirmResetPassword } from '../../src/contracts/user/confirmResetPassword';
import { registerSampleUsers } from '../seed-data';

jest.mock('../../src/common/mailjet');

const mocked_sendMailjetEmail = mocked(sendMailjetEmail);

setupDb();

beforeEach(async () => {
  await registerSampleUsers();
});

it('should reset password #integration', async () => {
  await resetPassword('user1');
  expect(mocked_sendMailjetEmail).toBeCalled();
  const options = mocked_sendMailjetEmail.mock.calls[0][0];
  expect(options.template.type).toEqual('actionButton');
  const exec = /confirm-reset-password\/(.+)/.exec(
    options.template.variables.link_url
  );
  expect(exec).toBeDefined();
  const code = exec![1];
  await confirmResetPassword(code, 'newPass123');
  const ret = await login({
    usernameOrEmail: 'user1',
    password: 'newPass123',
  });
  expect(ret.token).toBeTruthy();
});
