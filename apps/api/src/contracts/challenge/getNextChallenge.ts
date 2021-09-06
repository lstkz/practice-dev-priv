import { S } from 'schema';
import { NextChallengeInfo } from 'shared';
import { ChallengeCollection } from '../../collections/Challenge';
import { createContract, createRpcBinding } from '../../lib';
import { getChallengeByIdOrSlug } from './_common';

export const getNextChallenge = createContract('challenge.getNextChallenge')
  .params('values')
  .schema({
    values: S.object().keys({
      id: S.string().optional(),
      slug: S.string().optional(),
    }),
  })
  .returns<NextChallengeInfo>()
  .fn(async values => {
    const challenge = await getChallengeByIdOrSlug(values);
    const nextChallenge = await ChallengeCollection.findOne(
      {
        moduleId: challenge.moduleId,
        challengeModuleId: { $gt: challenge.challengeModuleId },
      },
      {
        sort: {
          challengeModuleId: 1,
        },
        limit: 1,
      }
    );
    if (!nextChallenge) {
      return {
        next: null,
      };
    }
    return {
      next: {
        id: nextChallenge._id,
        slug: nextChallenge.slug,
        title: nextChallenge.title,
      },
    };
  });

export const getNextChallengeRpc = createRpcBinding({
  signature: 'challenge.getNextChallenge',
  handler: getNextChallenge,
});
