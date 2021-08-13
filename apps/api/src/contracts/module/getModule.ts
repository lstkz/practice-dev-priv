import { S } from 'schema';
import { Module } from 'shared';
import { ModuleCollection } from '../../collections/Module';
import { AppError } from '../../common/errors';
import { createContract, createRpcBinding } from '../../lib';
import { populateModules } from './_common';

export const getModule = createContract('module.getModule')
  .params('user', 'id')
  .schema({
    user: S.object().appUser().optional(),
    id: S.number().integer(),
  })
  .returns<Module>()
  .fn(async (user, id) => {
    const module = await ModuleCollection.findById(id);
    if (!module) {
      throw new AppError('Module not found');
    }
    const populated = await populateModules(user, [module]);
    return populated[0];
  });

export const getModuleRpc = createRpcBinding({
  public: true,
  injectUser: true,
  signature: 'module.getModule',
  handler: getModule,
});
