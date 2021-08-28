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
  segment: {
    key: string | -1;
  };
  aws: {
    region: string;
    s3Bucket: string;
    testerLambdaName: string;
    bucketRoleArn: string;
  };
  adminToken: string;
  api: {
    port: number;
    eventQueueSuffix: string;
  };
  web: {
    useCDN: boolean;
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
  deploy: {
    lbCertArn: string;
    lbDomain: string;
    zone: {
      hostedZoneId: string;
      zoneName: string;
    };
    web: {
      cpu: number;
      memory: number;
      count: number;
    };
    api: {
      cpu: number;
      memory: number;
      count: number;
    };
    worker: {
      cpu: number;
      memory: number;
      count: number;
    };
    cdn: {
      certArn: string;
      domainName: string;
    };
    iframe: {
      certArn: string;
      domainName: string;
    };
  };
}
