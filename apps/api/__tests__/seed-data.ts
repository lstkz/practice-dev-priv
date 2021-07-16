import { createToken } from '../src/contracts/user/createToken';
import { createUser } from '../src/contracts/user/_common';
import { getId } from './helper';

export async function registerSampleUsers(isVerified = true) {
  await Promise.all([
    createUser({
      userId: getId(1),
      username: 'user1',
      email: 'user1@example.com',
      password: 'password1',
      isVerified: isVerified,
      subscribeNewsletter: true,
    }).then(() => createToken(getId(1), 'user1_token')),
    createUser({
      userId: getId(2),
      username: 'user2',
      email: 'user2@example.com',
      password: 'password2',
      isVerified: isVerified,
    }).then(() => createToken(getId(2), 'user2_token')),
  ]);
}
