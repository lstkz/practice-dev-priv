import { S } from 'schema';
import { SubmissionCollection } from '../../collections/Submission';
import { safeValues } from '../../common/helper';
import { SearchSubmissionsResult, SubmissionSortBy } from '../../generated';
import { createContract, createGraphqlBinding } from '../../lib';

export const searchSubmissions = createContract('submission.searchSubmissions')
  .params('appUser', 'criteria')
  .schema({
    appUser: S.object().appUser(),
    criteria: S.object().keys({
      limit: S.number().integer().min(0),
      offset: S.number().integer().min(0).max(100),
      sortBy: S.enum().literal(...safeValues(SubmissionSortBy)),
    }),
  })
  .returns<SearchSubmissionsResult>()
  .fn(async (appUser, criteria) => {
    const filter = {
      userId: appUser.id,
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
        nodes: item.nodes.map(node => ({
          id: node._id,
          name: node.name,
          parentId: node.parentId,
          type: node.type,
          s3Key: node.s3Key,
        })),
      })),
      total,
    };
  });

export const searchSubmissionsGraphql = createGraphqlBinding({
  resolver: {
    Query: {
      searchSubmissions: (_, { criteria }, { getUser }) =>
        searchSubmissions(getUser(), criteria),
    },
  },
});
