import { mocked } from 'ts-jest/utils';
import { getAppUser, getTokenOptions, resetDb, setupDb } from '../helper';
import { registerSampleUsers } from '../seed-data';
import { dispatchTask } from '../../src/dispatch';
import { apolloServer } from '../../src/server';
import { gql } from 'apollo-server';
import { resendVerificationCode } from '../../src/contracts/user/resendVerificationCode';

jest.mock('../../src/dispatch');

setupDb();

const mocked_dispatchTask = mocked(dispatchTask);

beforeEach(async () => {
  await registerSampleUsers(false);
});

it('should throw error if already verified', async () => {
  await resetDb();
  await registerSampleUsers(true);
  await expect(
    resendVerificationCode(await getAppUser(1))
  ).rejects.toThrowErrorMatchingInlineSnapshot(`"User is already verified"`);
  expect(mocked_dispatchTask).not.toBeCalled();
});

it('should submit verification code', async () => {
  await resendVerificationCode(await getAppUser(1));
  expect(mocked_dispatchTask).toBeCalled();
});

it('should make a change email request #graphql', async () => {
  const res = await apolloServer.executeOperation(
    {
      query: gql`
        mutation {
          resendVerificationCode
        }
      `,
    },
    getTokenOptions('user1_token')
  );
  expect(res.errors).toBeFalsy();
});
