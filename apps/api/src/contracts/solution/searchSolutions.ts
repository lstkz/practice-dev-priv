import { S } from 'schema';
import { PaginatedResult, Solution, SolutionSortBy } from 'shared';
import { SolutionCollection } from '../../collections/Solution';
import { doFn, safeValues } from '../../common/helper';
import { createContract, createRpcBinding } from '../../lib';
import { UserCollection } from '../../collections/User';
import { mapSolutions } from '../../common/mapper';
import { SolutionVoteCollection } from '../../collections/SolutionVote';

export const searchSolutions = createContract('solution.searchSolutions')
  .params('user', 'criteria')
  .schema({
    user: S.object().appUser(),
    criteria: S.object().keys({
      challengeId: S.string(),
      limit: S.number().integer().min(0),
      offset: S.number().integer().min(0).max(100),
      sortBy: S.enum().literal(...safeValues(SolutionSortBy)),
    }),
  })
  .returns<PaginatedResult<Solution>>()
  .fn(async (user, criteria) => {
    const filter = {
      challengeId: criteria.challengeId,
    };

    const [items, total] = await Promise.all([
      SolutionCollection.find(filter)
        .sort(
          doFn(() => {
            if (criteria.sortBy === SolutionSortBy.Best) {
              return {
                score: -1,
              };
            }
            return {
              createdAt: criteria.sortBy === SolutionSortBy.Newest ? -1 : 1,
            };
          })
        )
        .skip(criteria.offset)
        .limit(criteria.limit)
        .toArray(),
      SolutionCollection.countDocuments(filter),
    ]);
    const userIds = items.map(x => x.userId);
    const [users, solutionVotes] = await Promise.all([
      UserCollection.findAll({
        _id: {
          $in: userIds,
        },
      }),
      SolutionVoteCollection.findAll({
        userId: user._id,
        solutionId: {
          $in: items.map(x => x._id),
        },
      }),
    ]);
    return {
      items: mapSolutions(items, users, solutionVotes),
      total,
    };
  });

export const searchSolutionsRpc = createRpcBinding({
  injectUser: true,
  signature: 'solution.searchSolutions',
  handler: searchSolutions,
});
