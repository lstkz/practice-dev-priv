import { S } from 'schema';
import { Challenge, PaginatedResult } from 'shared';
import { ChallengeCollection } from '../../collections/Challenge';
import { createContract, createRpcBinding } from '../../lib';
import { populateChallenges } from './_common';

export const searchChallenges = createContract('challenge.searchChallenges')
  .params('user', 'criteria')
  .schema({
    user: S.object().appUser().optional(),
    criteria: S.object().keys({
      moduleId: S.number().integer(),
      limit: S.number().integer().min(0),
      offset: S.number().integer().min(0).max(100),
    }),
  })
  .returns<PaginatedResult<Challenge>>()
  .fn(async (user, criteria) => {
    const filter = {
      moduleId: criteria.moduleId,
    };
    const [items, total] = await Promise.all([
      ChallengeCollection.find(filter)
        .sort({
          challengeModuleId: 1,
        })
        .skip(criteria.offset)
        .limit(criteria.limit)
        .toArray(),
      ChallengeCollection.countDocuments(filter),
    ]);
    return {
      total,
      items: await populateChallenges(user, items),
    };
  });

export const searchChallengesRpc = createRpcBinding({
  injectUser: true,
  public: true,
  signature: 'challenge.searchChallenges',
  handler: searchChallenges,
});
