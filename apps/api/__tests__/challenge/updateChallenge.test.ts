import { gql } from 'apollo-server';
import { ChallengeCollection } from '../../src/collections/Challenge';
import { ModuleCollection } from '../../src/collections/Module';
import { updateChallenge } from '../../src/contracts/challenge/updateChallenge';
import { updateModule } from '../../src/contracts/module/updateModule';
import { apolloServer } from '../../src/server';
import { getTokenOptions, setupDb } from '../helper';
import { registerSampleUsers } from '../seed-data';

setupDb();

beforeEach(async () => {
  await registerSampleUsers();
  await updateModule({
    id: 1,
    title: 't1',
    description: 'desc1',
    mainTechnology: 'tech1',
    difficulty: 'diff1',
    tags: ['t1', 't2'],
  });
});

function getValidQuery() {
  return gql`
    mutation {
      updateChallenge(
        values: {
          challengeId: 1
          moduleId: 1
          title: "t1x"
          description: "desc1x"
          difficulty: "diff1x"
          detailsS3Key: "d_s3x"
          htmlS3Key: "h_s3x"
          practiceTime: 20
          files: [
            { directory: "dir1x", name: "f1x", s3Key: "f1_s3x" }
            { directory: "dir2", name: "f2", s3Key: "f2_s3" }
          ]
        }
      )
    }
  `;
}

function getValidValues() {
  return {
    challengeId: 1,
    moduleId: 1,
    title: 't1',
    description: 'desc1',
    difficulty: 'diff1',
    detailsS3Key: 'd_s3',
    htmlS3Key: 'h_s3',
    practiceTime: 10,
    files: [
      {
        directory: 'dir1',
        name: 'f1',
        s3Key: 'f1_s3',
      },
      {
        directory: 'dir2',
        name: 'f2',
        s3Key: 'f2_s3',
      },
    ],
  };
}

it('should throw if module does not exist', async () => {
  await expect(
    updateChallenge({
      ...getValidValues(),
      moduleId: 100,
    })
  ).rejects.toMatchInlineSnapshot(`[AppError: Module not found]`);
});

it('should create a new module and update it', async () => {
  await updateChallenge(getValidValues());
  expect(await ChallengeCollection.findByIdOrThrow('1_1'))
    .toMatchInlineSnapshot(`
    Object {
      "_id": "1_1",
      "challengeId": 1,
      "description": "desc1",
      "detailsS3Key": "d_s3",
      "difficulty": "diff1",
      "files": Array [
        Object {
          "directory": "dir1",
          "name": "f1",
          "s3Key": "f1_s3",
        },
        Object {
          "directory": "dir2",
          "name": "f2",
          "s3Key": "f2_s3",
        },
      ],
      "htmlS3Key": "h_s3",
      "moduleId": 1,
      "practiceTime": 10,
      "title": "t1",
    }
  `);
  await updateChallenge({
    challengeId: 1,
    moduleId: 1,
    title: 't1x',
    description: 'desc1x',
    difficulty: 'diff1x',
    detailsS3Key: 'd_s3x',
    htmlS3Key: 'h_s3x',
    practiceTime: 20,
    files: [
      {
        directory: 'dir1x',
        name: 'f1x',
        s3Key: 'f1_s3x',
      },
      {
        directory: 'dir2',
        name: 'f2',
        s3Key: 'f2_s3',
      },
    ],
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
});

it('should throw if not admin #graphql', async () => {
  const res = await apolloServer.executeOperation(
    {
      query: getValidQuery(),
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
          "updateChallenge",
        ],
      },
    ]
  `);
});

it('should update as admin #graphql', async () => {
  const res = await apolloServer.executeOperation(
    {
      query: getValidQuery(),
    },
    getTokenOptions('admin-test')
  );
  expect(res.errors).toBeFalsy();
});
