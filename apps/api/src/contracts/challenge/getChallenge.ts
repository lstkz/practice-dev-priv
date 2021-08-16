import * as R from 'remeda';
import { S } from 'schema';
import { ChallengeDetails } from 'shared';
import { ChallengeCollection } from '../../collections/Challenge';
import { AppError } from '../../common/errors';
import { createContract, createRpcBinding } from '../../lib';

export const getChallenge = createContract('challenge.getChallenge')
  .params('id')
  .schema({
    id: S.string(),
  })
  .returns<ChallengeDetails>()
  .fn(async id => {
    const challenge = await ChallengeCollection.findById(id);
    if (!challenge) {
      throw new AppError('Challenge not found');
    }
    return {
      id: challenge._id,
      ...R.pick(challenge, [
        'challengeModuleId',
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

export const getChallengeRpc = createRpcBinding({
  public: true,
  signature: 'challenge.getChallenge',
  handler: getChallenge,
});
