import {
  ApolloServer,
  AuthenticationError,
  ForbiddenError,
} from 'apollo-server-express';
import 'graphql-import-node';
import typeDefs from './schema.graphql';
import { resolvers } from './resolvers';
import { config } from 'config';
import { AppContext, AppUser } from './types';
import { UserCollection } from './collections/User';
import { AccessTokenCollection } from './collections/AccessToken';
import util from 'util';
import { ValidationError } from 'schema';

export const apolloServer = new ApolloServer({
  subscriptions: {
    path: '/subscriptions',
    onConnect: connectionParams => {
      return connectionParams;
    },
  },
  typeDefs,
  resolvers,
  context: async ({ req, connection }): Promise<AppContext> => {
    const token = connection
      ? connection.context.authorization
      : req?.headers['authorization'];
    let user: AppUser = null!;
    let isAdmin = false;
    if (token) {
      if (token === config.adminToken) {
        isAdmin = true;
      } else {
        const existing = await AccessTokenCollection.findById(token);
        if (!existing) {
          throw new AuthenticationError('Invalid access token');
        }
        const dbUser = await UserCollection.findByIdOrThrow(existing.userId);
        user = {
          email: dbUser.email,
          id: dbUser._id,
          username: dbUser.username,
        };
      }
    }
    return {
      ensureAdmin: () => {
        if (!isAdmin) {
          throw new ForbiddenError('No permission');
        }
      },
      getUser: () => {
        if (!user) {
          throw new AuthenticationError('Access token required');
        }
        return user;
      },
      getUserOrAnonymous: () => {
        return user;
      },
      getToken: () => {
        if (!token) {
          throw new AuthenticationError('Access token required');
        }
        return token;
      },
    };
  },
  formatError: err => {
    if (process.env.NODE_ENV !== 'test') {
      console.error(util.inspect(err, { depth: 10 }));
      console.error(err.name);
      console.error(err);
    }
    if (err.originalError instanceof ValidationError) {
      if (err.extensions) {
        err.extensions.code = 'VALIDATION_ERROR';
      }
    }
    return err;
  },
});
