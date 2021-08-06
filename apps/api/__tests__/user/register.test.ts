import { mocked } from 'ts-jest/utils';
import { register } from '../../src/contracts/user/register';
import { execContract, setupDb } from '../helper';
import { dispatchEvent } from '../../src/dispatch';

jest.mock('../../src/dispatch');

const mocked_dispatchEvent = mocked(dispatchEvent);

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
  const { user, token } = await execContract(register, {
    values: {
      email: 'user1@example.com',
      username: 'user1',
      password: 'password',
    },
  });
  expect(token).toBeDefined();
  expect(user.id).toBeDefined();
  expect(user.isVerified).toEqual(false);
  expect(user.email).toEqual('user1@example.com');
  expect(user.username).toEqual('user1');
  expect(mocked_dispatchEvent).toBeCalled();
});
