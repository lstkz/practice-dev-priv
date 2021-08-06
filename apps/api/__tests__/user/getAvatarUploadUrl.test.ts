import { getAvatarUploadUrl } from '../../src/contracts/user/getAvatarUploadUrl';
import { s3 } from '../../src/lib';
import { execContract, setupDb } from '../helper';
import { registerSampleUsers } from '../seed-data';

setupDb();

beforeEach(async () => {
  await registerSampleUsers();
});

it('should return a profile #graphql', async () => {
  s3.createPresignedPost = () => ({
    url: '/foo',
    fields: {
      'Content-Type': 'image/png',
      foo: 'bar',
    } as any,
  });
  const ret = await execContract(getAvatarUploadUrl, {}, 'user1_token');
  expect(ret).toMatchInlineSnapshot(`
Object {
  "fields": Array [
    Object {
      "name": "Content-Type",
      "value": "image/png",
    },
    Object {
      "name": "foo",
      "value": "bar",
    },
  ],
  "url": "/foo",
}
`);
});
