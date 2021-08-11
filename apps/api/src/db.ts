import { initDb } from 'mongodb2';
import { config } from 'config';

export const {
  createCollection,
  connect,
  withTransaction,
  getAllCollection,
  disconnect,
} = initDb({
  collections: () => [
    require('./collections/AccessToken'),
    require('./collections/User'),
    require('./collections/ConfirmEmailCode'),
    require('./collections/Flag'),
    require('./collections/ResetPasswordCode'),
    require('./collections/User'),
    require('./collections/ConfirmEmailChange'),
    require('./collections/Module'),
    require('./collections/Challenge'),
    require('./collections/Workspace'),
    require('./collections/WorkspaceNode'),
    require('./collections/Submission'),
    require('./collections/Solution'),
    require('./collections/SolutionLimit'),
    // APPEND
  ],
  uri: config.mongodb.url,
  dbName: config.mongodb.dbName,
});
