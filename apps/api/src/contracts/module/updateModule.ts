import { S } from 'schema';
import * as R from 'remeda';
import { createContract, createGraphqlBinding } from '../../lib';
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
  .fn(async values => {
    await ModuleCollection.findOneAndUpdate(
      {
        _id: values.id,
      },
      {
        $set: {
          ...R.omit(values, ['id']),
        },
      },
      {
        upsert: true,
      }
    );
  });

export const updateModuleGraphql = createGraphqlBinding({
  admin: true,
  resolver: {
    Mutation: {
      updateModule: (_, { values }, {}) => updateModule(values),
    },
  },
});
