import { S } from 'schema';
import { createContract, createGraphqlBinding } from '../../lib';


export const {{name}} = createContract('{{ns}}.{{name}}')
  .params('appUser', 'values')
  .schema({
    appUser: S.object().appUser(),
    values: S.object().keys({
    })
  })
  .fn(async (appUser, values) => {

  });

export const {{name}}Graphql = createGraphqlBinding({
  resolver: {
    Mutation: {
      {{name}}: (_, { values }, {getUser}) => 
       {{name}}(getUser(), values) 
      ,
    },
  },
});
