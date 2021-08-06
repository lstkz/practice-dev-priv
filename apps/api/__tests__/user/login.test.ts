import { login } from '../../src/contracts/user/login';
import { createUser } from '../../src/contracts/user/_common';
import { execContract, setupDb } from '../helper';

setupDb();

beforeEach(async () => {
  await createUser({
    email: 'user1@example.org',
    isVerified: true,
    password: 'pass123',
    username: 'TomTom',
  });
});

it('login successfully by email', async () => {
  const { user, token } = await execContract(login, {
    values: {
      usernameOrEmail: 'user1@example.org',
      password: 'pass123',
    },
  });
  expect(token).toBeDefined();
  expect(user.id).toBeDefined();
  expect(user.isVerified).toEqual(true);
  expect(user.email).toEqual('user1@example.org');
  expect(user.username).toEqual('TomTom');
});

it('login successfully by username', async () => {
  const { user, token } = await execContract(login, {
    values: {
      usernameOrEmail: 'TomTom',
      password: 'pass123',
    },
  });
  expect(token).toBeDefined();
  expect(user.id).toBeDefined();
  expect(user.isVerified).toEqual(true);
  expect(user.email).toEqual('user1@example.org');
  expect(user.username).toEqual('TomTom');
});

it('throw if invalid password', async () => {
  await expect(
    execContract(login, {
      values: {
        usernameOrEmail: 'TomTom',
        password: 'pass123456',
      },
    })
  ).rejects.toThrowErrorMatchingInlineSnapshot(
    `"Invalid credentials or user not found"`
  );
});

it('throw if user not found', async () => {
  await expect(
    execContract(login, {
      values: {
        usernameOrEmail: 'abc',
        password: 'pass123',
      },
    })
  ).rejects.toThrowErrorMatchingInlineSnapshot(
    `"Invalid credentials or user not found"`
  );
});
