import { gql } from 'apollo-server';
import { ModuleCollection } from '../../src/collections/Module';
import { updateModule } from '../../src/contracts/module/updateModule';
import { apolloServer } from '../../src/server';
import { getTokenOptions, setupDb } from '../helper';
import { registerSampleUsers } from '../seed-data';

jest.mock('../../src/dispatch');

setupDb();

beforeEach(async () => {
  await registerSampleUsers();
});

it('should create a new module and update it', async () => {
  await updateModule({
    id: 1,
    title: 't1',
    description: 'desc1',
    mainTechnology: 'tech1',
    difficulty: 'diff1',
    tags: ['t1', 't2'],
  });
  expect(await ModuleCollection.findByIdOrThrow(1)).toMatchInlineSnapshot(`
Object {
  "_id": 1,
  "description": "desc1",
  "difficulty": "diff1",
  "mainTechnology": "tech1",
  "tags": Array [
    "t1",
    "t2",
  ],
  "title": "t1",
}
`);
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
  "tags": Array [
    "t1",
    "t3",
  ],
  "title": "t2",
}
`);
});

it('should throw if not admin #graphql', async () => {
  const res = await apolloServer.executeOperation(
    {
      query: gql`
        mutation {
          updateModule(
            values: {
              id: 1
              title: "t2"
              description: "desc2"
              mainTechnology: "tech2"
              difficulty: "diff2"
              tags: ["t1", "t3"]
            }
          )
        }
      `,
    },
    getTokenOptions('user1_token')
  );
  expect(res.errors).toMatchInlineSnapshot(`
Array [
  Object {
    "extensions": Object {
      "code": "FORBIDDEN",
    },
    "locations": Array [
      Object {
        "column": 3,
        "line": 2,
      },
    ],
    "message": "No permission",
    "path": Array [
      "updateModule",
    ],
  },
]
`);
});

it('should update as admin #graphql', async () => {
  const res = await apolloServer.executeOperation(
    {
      query: gql`
        mutation {
          updateModule(
            values: {
              id: 1
              title: "t2"
              description: "desc2"
              mainTechnology: "tech2"
              difficulty: "diff2"
              tags: ["t1", "t3"]
            }
          )
        }
      `,
    },
    getTokenOptions('admin-test')
  );
  expect(res.errors).toBeFalsy();
});
