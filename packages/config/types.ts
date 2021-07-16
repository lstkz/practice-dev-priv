export interface AppConfig {
  logLevel: 'debug' | 'info';
  appBaseUrl: string;
  apiBaseUrl: string;
  rabbit: {
    hosts: string[];
    username: string;
    password: string;
    prefetchLimit: number;
    port?: number;
  };
  mongodb: {
    url: string;
    dbName: string;
  };
  aws: {
    region: string;
    sesRegion: string;
  };
  adminToken: string;
  api: {
    port: number;
    eventQueueSuffix: string;
  };
  web: {
    port: number;
  };
  emailSender: string;
  mixpanel: {
    apiKey: string | -1;
  };
  bugsnag: {
    apiKey: string | -1;
    workerKey: string | -1;
    frontKey: string | -1;
  };
  github: {
    clientId: string;
    clientSecret: string;
  };
  google: {
    clientId: string;
    clientSecret: string;
  };
}
