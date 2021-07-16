import { Resolvers } from '../types';

export const resolvers: Resolvers = {
  Mutation: {},
  Query: {
    me: (_, __, context) => {
      const user = context.getUser();
      return {
        id: user.id.toHexString(),
        username: user.username,
      };
    },
    ping: () => Date.now(),
  },
};
