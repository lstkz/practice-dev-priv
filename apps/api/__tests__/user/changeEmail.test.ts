import { gql } from 'apollo-server';
import { mocked } from 'ts-jest/utils';
import { ConfirmEmailChangeCollection } from '../../src/collections/ConfirmEmailChange';
import { UserCollection } from '../../src/collections/User';
import { changeEmail } from '../../src/contracts/user/changeEmail';
import { dispatchTask } from '../../src/dispatch';
import { apolloServer } from '../../src/server';
import { getAppUser, getId, getTokenOptions, setupDb } from '../helper';
import { registerSampleUsers } from '../seed-data';

jest.mock('../../src/dispatch');

const mocked_dispatchTask = mocked(dispatchTask);

setupDb();

beforeEach(async () => {
  await registerSampleUsers();
});

it('should throw if invalid email', async () => {
  await expect(
    changeEmail(await getAppUser(1), 'asd$5')
  ).rejects.toMatchInlineSnapshot(
    `[Error: Validation error: 'newEmail' must a valid email.]`
  );
});

it('should throw if duplicated', async () => {
  await expect(
    changeEmail(await getAppUser(1), 'useR2@example.com')
  ).rejects.toMatchInlineSnapshot(`[AppError: Email is already taken]`);
});

it('should change only case if email is the same', async () => {
  const ret = await changeEmail(await getAppUser(1), 'USER1@example.com');
  expect(ret).toEqual({ ok: false });
  const user = await UserCollection.findByIdOrThrow(getId(1));
  expect(user.email).toEqual('USER1@example.com');
  expect(mocked_dispatchTask).not.toBeCalled();
});

it('should make a change email request', async () => {
  const ret = await changeEmail(await getAppUser(1), 'fooo@example.com');
  expect(ret).toEqual({ ok: true });
  const user = await UserCollection.findByIdOrThrow(getId(1));
  expect(user.email).toEqual('user1@example.com');
  expect(mocked_dispatchTask).toBeCalled();
  const requests = await ConfirmEmailChangeCollection.findAll({});
  expect(requests).toHaveLength(1);
});

it('should make a change email request #graphql', async () => {
  const res = await apolloServer.executeOperation(
    {
      query: gql`
        mutation {
          changeEmail(email: "foo@example.com") {
            ok
          }
        }
      `,
    },
    getTokenOptions('user1_token')
  );
  expect(res.errors).toBeFalsy();
  expect(res.data).toMatchInlineSnapshot(`
Object {
  "changeEmail": Object {
    "ok": true,
  },
}
`);
});
