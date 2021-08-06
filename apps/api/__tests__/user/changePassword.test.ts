import { UserCollection } from '../../src/collections/User';
import { changePassword } from '../../src/contracts/user/changePassword';
import { execContract, getId, setupDb } from '../helper';
import { registerSampleUsers } from '../seed-data';

setupDb();

beforeEach(async () => {
  await registerSampleUsers();
});

it('should throw if invalid email', async () => {
  await expect(
    execContract(changePassword, { password: '12' }, 'user1_token')
  ).rejects.toMatchInlineSnapshot(
    `[Error: Validation error: 'password' length must be at least 5 characters long.]`
  );
});

it('should change the password', async () => {
  const user1 = await UserCollection.findByIdOrThrow(getId(1));
  await execContract(changePassword, { password: '123456' }, 'user1_token');
  const user2 = await UserCollection.findByIdOrThrow(getId(1));
  expect(user1.password).not.toEqual(user2);
});
