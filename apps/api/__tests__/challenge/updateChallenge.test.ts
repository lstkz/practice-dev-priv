import { ChallengeCollection } from '../../src/collections/Challenge';
import { updateChallenge } from '../../src/contracts/challenge/updateChallenge';
import { updateModule } from '../../src/contracts/module/updateModule';
import { execContract, setupDb } from '../helper';
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

function getValidValues() {
  return {
    challengeId: 1,
    moduleId: 1,
    title: 't1',
    description: 'desc1',
    difficulty: 'diff1',
    detailsS3Key: 'd_s3',
    htmlS3Key: 'h_s3',
    testS3Key: 't_s3',
    solutionUrl: 'sol',
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
    libraries: [
      {
        name: 'lib',
        source: 'source.js',
        types: 'types.ts',
      },
    ],
    tests: ['test'],
  };
}

it('should throw if module does not exist', async () => {
  await expect(
    execContract(
      updateChallenge,
      {
        values: {
          ...getValidValues(),
          moduleId: 100,
        },
      },
      'admin-test'
    )
  ).rejects.toMatchInlineSnapshot(`[AppError: Module not found]`);
});

it('should create a new module and update it', async () => {
  await execContract(
    updateChallenge,
    {
      values: getValidValues(),
    },
    'admin-test'
  );
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
      "libraries": Array [
        Object {
          "name": "lib",
          "source": "source.js",
          "types": "types.ts",
        },
      ],
      "moduleId": 1,
      "practiceTime": 10,
      "solutionUrl": "sol",
      "testS3Key": "t_s3",
      "tests": Array [
        "test",
      ],
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
    testS3Key: 't_s3x',
    practiceTime: 20,
    solutionUrl: 'sol2',
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
    libraries: [],
    tests: ['t3'],
  });
  expect(await ChallengeCollection.findByIdOrThrow('1_1'))
    .toMatchInlineSnapshot(`
    Object {
      "_id": "1_1",
      "challengeId": 1,
      "description": "desc1x",
      "detailsS3Key": "d_s3x",
      "difficulty": "diff1x",
      "files": Array [
        Object {
          "directory": "dir1x",
          "name": "f1x",
          "s3Key": "f1_s3x",
        },
        Object {
          "directory": "dir2",
          "name": "f2",
          "s3Key": "f2_s3",
        },
      ],
      "htmlS3Key": "h_s3x",
      "libraries": Array [],
      "moduleId": 1,
      "practiceTime": 20,
      "solutionUrl": "sol2",
      "testS3Key": "t_s3x",
      "tests": Array [
        "t3",
      ],
      "title": "t1x",
    }
  `);
});

it('should throw if not admin ', async () => {
  await expect(
    execContract(
      updateChallenge,
      {
        values: getValidValues(),
      },

      'user1_token'
    )
  ).rejects.toMatchInlineSnapshot(`[Error: Admin only]`);
});
