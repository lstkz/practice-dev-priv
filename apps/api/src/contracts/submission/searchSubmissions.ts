import { S } from 'schema';
import * as R from 'remeda';
import { PaginatedResult, Submission, SubmissionSortBy } from 'shared';
import { ChallengeCollection } from '../../collections/Challenge';
import { SubmissionCollection } from '../../collections/Submission';
import { UserCollection } from '../../collections/User';
import { AppError } from '../../common/errors';
import { safeValues } from '../../common/helper';
import { createContract, createRpcBinding } from '../../lib';

export const searchSubmissions = createContract('submission.searchSubmissions')
  .params('user', 'criteria')
  .schema({
    user: S.object().appUser().optional(),
    criteria: S.object().keys({
      challengeId: S.string().optional(),
      username: S.string().optional(),
      limit: S.number().integer().min(0),
      offset: S.number().integer().min(0).max(100),
      sortBy: S.enum().literal(...safeValues(SubmissionSortBy)),
    }),
  })
  .returns<PaginatedResult<Submission>>()
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
      SubmissionCollection.find(filter)
        .sort({
          createdAt: criteria.sortBy === SubmissionSortBy.Newest ? -1 : 1,
        })
        .skip(criteria.offset)
        .limit(criteria.limit)
        .toArray(),
      SubmissionCollection.countDocuments(filter),
    ]);
    const challengeIds = items.map(x => x.challengeId);
    const challenges = await ChallengeCollection.findAll({
      _id: {
        $in: challengeIds,
      },
    });
    const challengeMap = R.indexBy(challenges, x => x._id);
    return {
      items: items.map(item => {
        const challenge = challengeMap[item.challengeId];
        return {
          id: item._id.toHexString(),
          createdAt: item.createdAt.toISOString(),
          status: item.status,
          challenge: {
            id: challenge._id,
            title: challenge.title,
            slug: challenge.slug,
          },
        };
      }),
      total,
    };
  });

export const searchSubmissionsRpc = createRpcBinding({
  injectUser: true,
  public: true,
  signature: 'submission.searchSubmissions',
  handler: searchSubmissions,
});
