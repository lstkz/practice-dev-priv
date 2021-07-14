import { AppConfig } from './types';

export const config: AppConfig = {
  logLevel: 'debug',
  appBaseUrl: 'http://app.example.org',
  apiBaseUrl: 'http://api.example.org',
  gcp: {
    project: 'xyz',
    region: 'europe-west1',
  },
  mongodb: {
    url: 'mongodb://localhost:27017',
    dbName: 'fs',
  },
  adminToken: 'admin-test',
  api: {
    port: 3000,
  },
  web: {
    port: 4000,
  },
  emailSender: 'test@example.org',
  bugsnag: {
    apiKey: -1,
    workerKey: -1,
    frontKey: -1,
  },
  mixpanel: {
    apiKey: -1,
  },
  github: {
    clientId: 'mocked',
    clientSecret: 'mocked',
  },
  google: {
    clientId: 'mocked',
    clientSecret: 'mocked',
  },
};
