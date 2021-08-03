export interface AppConfig {
  logLevel: 'debug' | 'info';
  appBaseUrl: string;
  apiBaseUrl: string;
  proxyApiBaseUrl?: string;
  cdnBaseUrl: string;
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
  workspace: {
    expirationHours: number;
  };
  aws: {
    region: string;
    s3Bucket: string;
    testerLambdaName: string;
  };
  adminToken: string;
  api: {
    port: number;
    eventQueueSuffix: string;
  };
  web: {
    port: number;
  };
  iframe: {
    parentOrigin: string;
    origin: string;
    port?: number;
  };
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
  mailjet: {
    publicKey: string;
    privateKey: string;
    senderEmail: string;
    senderName: string;
    templates: {
      actionButton: number;
    };
  };
}
