import { S } from 'schema';
import { PaginatedResult, Solution, SolutionSortBy } from 'shared';
import { SolutionCollection } from '../../collections/Solution';
import { doFn, safeValues } from '../../common/helper';
import { createContract, createRpcBinding } from '../../lib';
import { UserCollection } from '../../collections/User';
import { mapSolutions } from '../../common/mapper';
import { SolutionVoteCollection } from '../../collections/SolutionVote';
import { AppError } from '../../common/errors';
import { ChallengeCollection } from '../../collections/Challenge';

export const searchSolutions = createContract('solution.searchSolutions')
  .params('user', 'criteria')
  .schema({
    user: S.object().appUser().optional(),
    criteria: S.object().keys({
      challengeId: S.string().optional(),
      username: S.string().optional(),
      limit: S.number().integer().min(0),
      offset: S.number().integer().min(0).max(100),
      sortBy: S.enum().literal(...safeValues(SolutionSortBy)),
    }),
  })
  .returns<PaginatedResult<Solution>>()
  .fn(async (user, criteria) => {
    const filter: Record<string, any> = {};
    if (criteria.challengeId) {
      filter.challengeId = criteria.challengeId;
    }
    if (criteria.username) {
      const author = await UserCollection.findOneByUsername(criteria.username);
      if (!author) {
        throw new AppError('User not found');
      }
      filter.userId = author._id;
    }
    if (Object.keys(filter).length === 0) {
      throw new AppError('challengeId or userId required');
    }
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
    const challengeIds = items.map(x => x.challengeId);
    const [users, challenges, solutionVotes] = await Promise.all([
      UserCollection.findAll({
        _id: {
          $in: userIds,
        },
      }),
      ChallengeCollection.findAll({
        _id: {
          $in: challengeIds,
        },
      }),
      user
        ? SolutionVoteCollection.findAll({
            userId: user._id,
            solutionId: {
              $in: items.map(x => x._id),
            },
          })
        : [],
    ]);
    return {
      items: mapSolutions(items, users, challenges, solutionVotes),
      total,
    };
  });

export const searchSolutionsRpc = createRpcBinding({
  injectUser: true,
  public: true,
  signature: 'solution.searchSolutions',
  handler: searchSolutions,
});
