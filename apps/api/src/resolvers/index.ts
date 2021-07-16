import deepMerge from 'deepmerge';
import { getBindings } from '../common/bindings';
import { Resolvers } from '../generated';

export const resolvers: Resolvers = deepMerge.all(
  getBindings('graphql').map(x => x.resolver)
);
