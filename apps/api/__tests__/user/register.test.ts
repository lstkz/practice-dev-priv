import { gql } from 'apollo-server';
import { register } from '../../src/contracts/user/register';
import { apolloServer } from '../../src/server';
import { setupDb } from '../helper';

setupDb();

describe('validation', () => {
  const validEmail = 'user@example.com';
  const validPassword = 'password';
  const validUsername = 'username';

  test.each([
    [
      {
        email: 'a',
        username: validUsername,
        password: validPassword,
      },
      "Validation error: 'values.email' must a valid email.",
    ],
    [
      {
        email: validEmail,
        username: validUsername,
        password: 'a',
      },
      "Validation error: 'values.password' length must be at least 5 characters long.",
    ],
    [
      {
        email: validEmail,
        username: '$2',
        password: validPassword,
      },
      "Validation error: 'values.username' must match regex",
    ],
  ] as const)(
    '.register(%p) should throw `%s`',
    async (input, errorMessage) => {
      await expect(register(input)).rejects.toThrow(errorMessage);
    }
  );
});

it('register user successfully', async () => {
  const { user, token } = await register({
    email: 'user1@example.com',
    username: 'user1',
    password: 'password',
  });
  expect(token).toBeDefined();
  expect(user.id).toBeDefined();
  expect(user.isVerified).toEqual(false);
  expect(user.email).toEqual('user1@example.com');
  expect(user.username).toEqual('user1');
});

it('register user successfully #graphql', async () => {
  const res = await apolloServer.executeOperation({
    query: gql`
      mutation {
        register(
          values: {
            email: "user1@example.org"
            password: "123456"
            username: "user1"
          }
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
  "register": Object {
    "user": Object {
      "email": "user1@example.org",
      "username": "user1",
    },
  },
}
`);
  expect(res.errors).toBeFalsy();
});

it('register with errors #graphql', async () => {
  const res = await apolloServer.executeOperation({
    query: gql`
      mutation {
        register(
          values: { email: "aa", password: "123456", username: "user1" }
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
      "code": "VALIDATION_ERROR",
      "exception": Object {
        "errors": Array [
          Object {
            "message": "must a valid email",
            "path": Array [
              "values",
              "email",
            ],
            "type": "string.email",
            "value": "aa",
          },
        ],
      },
    },
    "locations": Array [
      Object {
        "column": 3,
        "line": 2,
      },
    ],
    "message": "Validation error: 'values.email' must a valid email.",
    "path": Array [
      "register",
    ],
  },
]
`);
});
