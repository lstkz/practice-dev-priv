import { mocked } from 'ts-jest/utils';
import { confirmChangeEmail } from '../../src/contracts/user/confirmChangeEmail';
import { getAppUser, setupDb } from '../helper';
import { registerSampleUsers } from '../seed-data';
import { changeEmail } from '../../src/contracts/user/changeEmail';
import { sendMailjetEmail } from '../../src/common/mailjet';
import { login } from '../../src/contracts/user/login';

jest.mock('../../src/common/mailjet');

const mocked_sendMailjetEmail = mocked(sendMailjetEmail);

setupDb();

beforeEach(async () => {
  await registerSampleUsers(false);
});

it('request change email, confirm it and log in #integration', async () => {
  const appUser = await getAppUser(1);
  await changeEmail(appUser, 'fooo@example.com');
  const options = mocked_sendMailjetEmail.mock.calls[0][0];
  expect(options.template.type).toEqual('actionButton');
  const exec = /confirm-new-email=(.+)/.exec(
    options.template.variables.link_url
  );
  expect(exec).toBeDefined();
  const code = exec![1];
  await confirmChangeEmail(appUser, code);
  const ret = await login({
    usernameOrEmail: 'fooo@example.com',
    password: 'password1',
  });
  expect(ret.user.email).toEqual('fooo@example.com');
  expect(ret.user.isVerified).toEqual(true);
});
