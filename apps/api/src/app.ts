import { ApolloServer, AuthenticationError } from 'apollo-server-express';
import express from 'express';
import 'graphql-import-node';
import stoppable from 'stoppable';
import typeDefs from './schema.graphql';
import { resolvers } from './resolvers';
import { connect } from './db';
import { AppContext, AppUser } from './types';
import { UserCollection } from './collections/User';
import { AccessTokenCollection } from './collections/AccessToken';
import { IncomingMessage } from 'http';
import util from 'util';
import { getDuration } from './common/helper';
import { addShownDownAction, setupGracefulShutdown } from './shutdown';
import { config } from 'config';
import { ampq } from './lib';

const apolloServer = new ApolloServer({
  subscriptions: {
    path: '/subscriptions',
    onConnect: connectionParams => {
      return connectionParams;
    },
  },
  typeDefs,
  resolvers,
  context: async ({
    req,
    connection,
  }: {
    req: IncomingMessage;
    connection: any;
  }): Promise<AppContext> => {
    const token = connection
      ? connection.context.authorization
      : req.headers['authorization'];
    let user: AppUser = null!;
    if (token) {
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
    return {
      getUser: () => {
        if (!user) {
          throw new AuthenticationError('Access token required');
        }
        return user;
      },
      getUserOrAnonymous: () => {
        return user;
      },
    };
  },
  formatError: err => {
    console.error(util.inspect(err, { depth: 10 }));
    console.error(err.name);
    console.error(err);
    // if (err instanceof ZodError) {
    //   const newErr = new ValidationError(err.message);
    //   throw newErr;
    // }
    return err;
    // throw err;
  },
});

async function start() {
  await Promise.all([connect(), ampq.connect(['publish'])]);
  const app = express();
  apolloServer.applyMiddleware({ app });
  const httpServer = await app.listen(config.api.port, '0.0.0.0', () => {
    console.log(
      `Express HTTP server listening on port ${config.api.port} in ${process.env.NODE_ENV} mode`
    );
  });
  stoppable(httpServer, getDuration(30, 's'));
  const asyncServerStop = util.promisify(apolloServer.stop).bind(apolloServer);
  addShownDownAction(100, async () => {
    console.log('[Server] shuting down');
    await asyncServerStop();
    console.log('[Server] shutdown success');
  });
}

start().catch(e => {
  console.error(e);
  process.exit(1);
});
setupGracefulShutdown();
