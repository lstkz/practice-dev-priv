import { S } from 'schema';
import * as R from 'remeda';
import { createContract, createRpcBinding } from '../../lib';
import { ModuleCollection } from '../../collections/Module';

export const updateModule = createContract('module.updateModule')
  .params('values')
  .schema({
    values: S.object().keys({
      id: S.number(),
      title: S.string(),
      description: S.string(),
      mainTechnology: S.string(),
      difficulty: S.string(),
      tags: S.array().items(S.string()),
    }),
  })
  .returns<void>()
  .fn(async values => {
    await ModuleCollection.findOneAndUpdate(
      {
        _id: values.id,
      },
      {
        $set: {
          ...R.omit(values, ['id']),
        },
        $setOnInsert: {
          stats: {
            enrolledUsers: 0,
          },
        },
      },
      {
        upsert: true,
      }
    );
  });

export const updateModuleRpc = createRpcBinding({
  admin: true,
  signature: 'module.updateModule',
  handler: updateModule,
});
