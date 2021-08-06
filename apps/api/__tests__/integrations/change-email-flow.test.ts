import { mocked } from 'ts-jest/utils';
import { confirmChangeEmail } from '../../src/contracts/user/confirmChangeEmail';
import { execContract, setupDb } from '../helper';
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
  await execContract(
    changeEmail,
    { newEmail: 'fooo@example.com' },
    'user1_token'
  );
  const options = mocked_sendMailjetEmail.mock.calls[0][0];
  expect(options.template.type).toEqual('actionButton');
  const exec = /confirm-new-email=(.+)/.exec(
    options.template.variables.link_url
  );
  expect(exec).toBeDefined();
  const code = exec![1];
  await execContract(confirmChangeEmail, { code }, 'user1_token');
  const ret = await login({
    usernameOrEmail: 'fooo@example.com',
    password: 'password1',
  });
  expect(ret.user.email).toEqual('fooo@example.com');
  expect(ret.user.isVerified).toEqual(true);
});
