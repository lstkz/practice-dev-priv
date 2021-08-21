import { S } from 'schema';
import { Module } from 'shared';
import { ModuleCollection } from '../../collections/Module';
import { AppError } from '../../common/errors';
import { doFn } from '../../common/helper';
import { createContract, createRpcBinding } from '../../lib';
import { populateModules } from './_common';

export const getModule = createContract('module.getModule')
  .params('user', 'values')
  .schema({
    user: S.object().appUser().optional(),
    values: S.object().keys({
      id: S.number().integer().optional(),
      slug: S.string().optional(),
    }),
  })
  .returns<Module>()
  .fn(async (user, values) => {
    if (!values.id && !values.slug) {
      throw new AppError('id or slug required');
    }
    const module = await doFn(async () => {
      if (values.id) {
        return ModuleCollection.findById(values.id);
      }
      return ModuleCollection.findOne({
        slug: values.slug,
      });
    });
    if (!module) {
      throw new AppError('Module not found');
    }
    if (module.isComingSoon) {
      throw new AppError('Module is not published');
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
