import deepMerge from 'deepmerge';
import { getBindings } from '../common/bindings';
import { Resolvers } from '../generated';
import { AppContext } from '../types';

export const resolvers: Resolvers = deepMerge.all(
  getBindings('graphql').map(binding => {
    const props = ['Mutation', 'Query'] as const;
    props.forEach(prop => {
      const root: any = binding.resolver[prop];
      if (!root) {
        return;
      }
      Object.keys(root).forEach(key => {
        const org = root[key];
        root[key] = (...args: any[]) => {
          const context = args[2] as AppContext;
          if (binding.admin) {
            context.ensureAdmin();
          }
          return org(...args);
        };
      });
    });
    return binding.resolver;
  })
);
