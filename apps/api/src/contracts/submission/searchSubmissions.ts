import { S } from 'schema';
import { PaginatedResult, Submission, SubmissionSortBy } from 'shared';
import { SubmissionCollection } from '../../collections/Submission';
import { safeValues } from '../../common/helper';
import { createContract, createRpcBinding } from '../../lib';

export const searchSubmissions = createContract('submission.searchSubmissions')
  .params('user', 'criteria')
  .schema({
    user: S.object().appUser(),
    criteria: S.object().keys({
      limit: S.number().integer().min(0),
      offset: S.number().integer().min(0).max(100),
      sortBy: S.enum().literal(...safeValues(SubmissionSortBy)),
    }),
  })
  .returns<PaginatedResult<Submission>>()
  .fn(async (user, criteria) => {
    const filter = {
      userId: user._id,
    };
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
    return {
      items: items.map(item => ({
        id: item._id.toHexString(),
        createdAt: item.createdAt.toISOString(),
        status: item.status,
      })),
      total,
    };
  });

export const searchSubmissionsRpc = createRpcBinding({
  injectUser: true,
  signature: 'submission.searchSubmissions',
  handler: searchSubmissions,
});
