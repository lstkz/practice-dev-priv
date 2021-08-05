import * as R from 'remeda';
import { S } from 'schema';
import { ChallengeCollection } from '../../collections/Challenge';
import { AppError } from '../../common/errors';
import { Challenge } from '../../generated';
import { createContract, createGraphqlBinding } from '../../lib';

export const getChallenge = createContract('challenge.getChallenge')
  .params('id')
  .schema({
    id: S.string(),
  })
  .returns<Challenge>()
  .fn(async id => {
    const challenge = await ChallengeCollection.findById(id);
    if (!challenge) {
      throw new AppError('Challenge not found');
    }
    return {
      id: challenge._id,
      ...R.pick(challenge, [
        'challengeId',
        'moduleId',
        'title',
        'description',
        'difficulty',
        'practiceTime',
        'detailsS3Key',
        'htmlS3Key',
        'solutionUrl',
        'tests',
      ]),
    };
  });

export const getChallengeGraphql = createGraphqlBinding({
  resolver: {
    Query: {
      getChallenge: (_, { id }) => getChallenge(id),
    },
  },
});
