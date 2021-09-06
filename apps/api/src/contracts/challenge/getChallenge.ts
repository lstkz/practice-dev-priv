import * as R from 'remeda';
import { S } from 'schema';
import { ChallengeDetails } from 'shared';
import { createContract, createRpcBinding } from '../../lib';
import { getChallengeByIdOrSlug } from './_common';

export const getChallenge = createContract('challenge.getChallenge')
  .params('values')
  .schema({
    values: S.object().keys({
      id: S.string().optional(),
      slug: S.string().optional(),
    }),
  })
  .returns<ChallengeDetails>()
  .fn(async values => {
    const challenge = await getChallengeByIdOrSlug(values);
    return {
      id: challenge._id,
      ...R.pick(challenge, [
        'challengeModuleId',
        'title',
        'slug',
        'moduleId',
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
