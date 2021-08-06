import { getAwsUploadContentAuth } from '../../src/contracts/aws/getAwsUploadContentAuth';
import { execContract, setupDb } from '../helper';
import { registerSampleUsers } from '../seed-data';

setupDb();

beforeEach(async () => {
  await registerSampleUsers();
});

it('should throw if not admin', async () => {
  await expect(
    execContract(getAwsUploadContentAuth, {}, 'user1_token')
  ).rejects.toMatchInlineSnapshot(`[Error: Admin only]`);
});
