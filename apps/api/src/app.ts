import express from 'express';
import 'graphql-import-node';
import stoppable from 'stoppable';
import { connect } from './db';
import util from 'util';
import cors from 'cors';
import { getDuration } from './common/helper';
import { addShownDownAction, setupGracefulShutdown } from './shutdown';
import { config } from 'config';
import { ampq } from './lib';
import { apolloServer } from './server';

async function start() {
  await Promise.all([connect(), ampq.connect(['publish'])]);
  const app = express();
  app.use(cors());
  apolloServer.applyMiddleware({ app });
  const httpServer = await app.listen(config.api.port, '0.0.0.0', () => {
    console.log(
      `Express HTTP server listening on port ${config.api.port} in ${process.env.NODE_ENV} mode`
    );
  });
  apolloServer.installSubscriptionHandlers(httpServer);
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
