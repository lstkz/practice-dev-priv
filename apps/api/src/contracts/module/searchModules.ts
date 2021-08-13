import { S } from 'schema';
import { Module, PaginatedResult } from 'shared';
import { ModuleCollection } from '../../collections/Module';
import { createContract, createRpcBinding } from '../../lib';
import { populateModules } from './_common';

export const searchModules = createContract('module.searchModules')
  .params('user', 'criteria')
  .schema({
    user: S.object().appUser().optional(),
    criteria: S.object().keys({
      limit: S.number().integer().min(0),
      offset: S.number().integer().min(0).max(100),
    }),
  })
  .returns<PaginatedResult<Module>>()
  .fn(async (user, criteria) => {
    const filter = {};
    const [items, total] = await Promise.all([
      ModuleCollection.find(filter)
        .sort({
          _id: 1,
        })
        .skip(criteria.offset)
        .limit(criteria.limit)
        .toArray(),
      ModuleCollection.countDocuments(filter),
    ]);
    return {
      total,
      items: await populateModules(user, items),
    };
  });

export const searchModulesRpc = createRpcBinding({
  injectUser: true,
  public: true,
  signature: 'module.searchModules',
  handler: searchModules,
});
