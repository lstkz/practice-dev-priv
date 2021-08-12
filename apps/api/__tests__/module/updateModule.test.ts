import { ModuleCollection } from '../../src/collections/Module';
import { updateModule } from '../../src/contracts/module/updateModule';
import { execContract, setupDb } from '../helper';
import { registerSampleUsers } from '../seed-data';

jest.mock('../../src/dispatch');

setupDb();

beforeEach(async () => {
  await registerSampleUsers();
});

it('should create a new module and update it', async () => {
  await execContract(
    updateModule,
    {
      values: {
        id: 1,
        title: 't1',
        description: 'desc1',
        mainTechnology: 'tech1',
        difficulty: 'diff1',
        tags: ['t1', 't2'],
      },
    },
    'admin-test'
  );

  expect(await ModuleCollection.findByIdOrThrow(1)).toMatchInlineSnapshot(`
Object {
  "_id": 1,
  "description": "desc1",
  "difficulty": "diff1",
  "mainTechnology": "tech1",
  "stats": Object {
    "enrolledUsers": 0,
  },
  "tags": Array [
    "t1",
    "t2",
  ],
  "title": "t1",
}
`);
  await ModuleCollection.findOneAndUpdate(
    {
      _id: 1,
    },
    {
      $set: {
        stats: {
          enrolledUsers: 10,
        },
      },
    }
  );
  await updateModule({
    id: 1,
    title: 't2',
    description: 'desc2',
    mainTechnology: 'tech2',
    difficulty: 'diff2',
    tags: ['t1', 't3'],
  });
  expect(await ModuleCollection.findByIdOrThrow(1)).toMatchInlineSnapshot(`
Object {
  "_id": 1,
  "description": "desc2",
  "difficulty": "diff2",
  "mainTechnology": "tech2",
  "stats": Object {
    "enrolledUsers": 10,
  },
  "tags": Array [
    "t1",
    "t3",
  ],
  "title": "t2",
}
`);
});

it('should throw if not admin', async () => {
  await expect(
    execContract(
      updateModule,
      {
        values: {
          id: 1,
          title: 't1',
          description: 'desc1',
          mainTechnology: 'tech1',
          difficulty: 'diff1',
          tags: ['t1', 't2'],
        },
      },

      'user1_token'
    )
  ).rejects.toMatchInlineSnapshot(`[Error: Admin only]`);
});
