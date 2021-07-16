import { S } from 'schema';
import { createContract, createGraphqlBinding } from '../../lib';


export const {{name}} = createContract('{{ns}}.{{name}}')
  .params('user', 'values')
  .schema({
    user: S.object().appUser(),
    values: S.object().keys({
    })
  })
  .fn(async (user, values) => {

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
