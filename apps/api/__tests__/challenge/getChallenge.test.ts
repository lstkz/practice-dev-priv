import { gql } from 'apollo-server';
import { getChallenge } from '../../src/contracts/challenge/getChallenge';
import { apolloServer } from '../../src/server';
import { setupDb } from '../helper';
import { createSampleChallenges, registerSampleUsers } from '../seed-data';

setupDb();

beforeEach(async () => {
  await registerSampleUsers();
  await createSampleChallenges();
});

it('should throw if not found', async () => {
  await expect(getChallenge('101')).rejects.toMatchInlineSnapshot(
    `[AppError: Challenge not found]`
  );
});

it('should return a challenge', async () => {
  expect(await getChallenge('1_2')).toMatchInlineSnapshot(`
Object {
  "challengeId": 2,
  "description": "desc",
  "detailsS3Key": "",
  "difficulty": "easy",
  "htmlS3Key": "",
  "moduleId": 1,
  "practiceTime": 10,
  "solutionUrl": "sol",
  "title": "challenge 2",
}
`);
});

it('should update as admin #graphql', async () => {
  const res = await apolloServer.executeOperation({
    query: gql`
      query {
        getChallenge(id: "1_2") {
          title
        }
      }
    `,
  });
  expect(res.errors).toBeFalsy();
  expect(res.data).toMatchInlineSnapshot(`
Object {
  "getChallenge": Object {
    "title": "challenge 2",
  },
}
`);
});
