import { gql } from 'apollo-server';
import { login } from '../../src/contracts/user/login';
import { createUser } from '../../src/contracts/user/_common';
import { apolloServer } from '../../src/server';
import { setupDb } from '../helper';

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
  const { user, token } = await login({
    usernameOrEmail: 'user1@example.org',
    password: 'pass123',
  });
  expect(token).toBeDefined();
  expect(user.id).toBeDefined();
  expect(user.isVerified).toEqual(true);
  expect(user.email).toEqual('user1@example.org');
  expect(user.username).toEqual('TomTom');
});

it('login successfully by username', async () => {
  const { user, token } = await login({
    usernameOrEmail: 'TomTom',
    password: 'pass123',
  });
  expect(token).toBeDefined();
  expect(user.id).toBeDefined();
  expect(user.isVerified).toEqual(true);
  expect(user.email).toEqual('user1@example.org');
  expect(user.username).toEqual('TomTom');
});

it('throw if invalid password', async () => {
  await expect(
    login({
      usernameOrEmail: 'TomTom',
      password: 'pass123456',
    })
  ).rejects.toThrowErrorMatchingInlineSnapshot(
    `"Invalid credentials or user not found"`
  );
});

it('throw if user not found', async () => {
  await expect(
    login({
      usernameOrEmail: 'abc',
      password: 'pass123',
    })
  ).rejects.toThrowErrorMatchingInlineSnapshot(
    `"Invalid credentials or user not found"`
  );
});

it('login user successfully #graphql', async () => {
  const res = await apolloServer.executeOperation({
    query: gql`
      mutation {
        login(
          values: { usernameOrEmail: "user1@example.org", password: "pass123" }
        ) {
          user {
            username
            email
          }
        }
      }
    `,
  });
  expect(res.data).toMatchInlineSnapshot(`
Object {
  "login": Object {
    "user": Object {
      "email": "user1@example.org",
      "username": "TomTom",
    },
  },
}
`);
  expect(res.errors).toBeFalsy();
});

it('login with errors #graphql', async () => {
  const res = await apolloServer.executeOperation({
    query: gql`
      mutation {
        login(
          values: { usernameOrEmail: "user1@example.org", password: "123" }
        ) {
          user {
            username
            email
          }
        }
      }
    `,
  });
  expect(res.errors).toMatchInlineSnapshot(`
Array [
  Object {
    "extensions": Object {
      "code": "APP_ERROR",
    },
    "locations": Array [
      Object {
        "column": 3,
        "line": 2,
      },
    ],
    "message": "Invalid credentials or user not found",
    "path": Array [
      "login",
    ],
  },
]
`);
});
