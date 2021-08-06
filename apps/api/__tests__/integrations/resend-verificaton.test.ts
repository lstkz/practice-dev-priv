import { mocked } from 'ts-jest/utils';
import { execContract, setupDb } from '../helper';
import { confirmEmail } from '../../src/contracts/user/confirmEmail';
import { registerSampleUsers } from '../seed-data';
import { login } from '../../src/contracts/user/login';
import { resendVerificationCode } from '../../src/contracts/user/resendVerificationCode';
import { sendMailjetEmail } from '../../src/common/mailjet';

setupDb();

jest.mock('../../src/common/mailjet');

const mocked_sendMailjetEmail = mocked(sendMailjetEmail);

beforeEach(async () => {
  await registerSampleUsers(false);
});

it('should resubmit verification code #integration', async () => {
  await execContract(resendVerificationCode, {}, 'user1_token');
  expect(mocked_sendMailjetEmail).toBeCalled();
  const options = mocked_sendMailjetEmail.mock.calls[0][0];
  expect(options.template.type).toEqual('actionButton');
  const exec = /confirm-email=(.+)/.exec(options.template.variables.link_url);
  expect(exec).toBeDefined();
  const code = exec![1];
  await confirmEmail(code);
  const ret = await login({
    usernameOrEmail: 'user1',
    password: 'password1',
  });
  expect(ret.user.isVerified).toEqual(true);
});
