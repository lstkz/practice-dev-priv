import * as docker from '@pulumi/docker';
import * as gcp from '@pulumi/gcp';
import * as pulumi from '@pulumi/pulumi';
import { config, getMaybeStagePasswordEnv } from '../packages/config';

const location = config.gcp.region;

const cdnBucket = new gcp.storage.Bucket('cdn-bucket', { location: 'EU' });
const cdnBackend = new gcp.compute.BackendBucket('cdn-backend', {
  description: 'App cdn',
  bucketName: cdnBucket.name,
  enableCdn: true,
});

export const cdnUrl = cdnBackend.selfLink;
export const cdnUrl2 = cdnBucket.url;

const imageName = 'common';
const dockerImage = new docker.Image(imageName, {
  imageName: pulumi.interpolate`gcr.io/${config.gcp.project}/${imageName}:v1.0.0`,
  build: {
    context: '../',
  },
});

function getEnv() {
  const ret: any[] = [];
  const env: Record<string, string> = getMaybeStagePasswordEnv();
  Object.keys(env).forEach(name => {
    ret.push({
      name,
      value: env[name],
    });
  });
  return ret;
}

function createApp() {
  const service = new gcp.cloudrun.Service('app', {
    location,
    template: {
      spec: {
        containers: [
          {
            image: dockerImage.imageName,
            ports: [
              {
                containerPort: config.web.port,
              },
            ],
            resources: {
              limits: {
                memory: '1Gi',
              },
            },
            commands: ['yarn'],
            args: ['run', 'start:app'],
            envs: getEnv(),
          },
        ],
        containerConcurrency: 50,
      },
    },
  });
  new gcp.cloudrun.IamMember('app-everyone', {
    service: service.name,
    location,
    role: 'roles/run.invoker',
    member: 'allUsers',
  });
  return service.statuses[0].url;
}

function createApi() {
  const service = new gcp.cloudrun.Service('api', {
    location,
    template: {
      spec: {
        containers: [
          {
            image: dockerImage.imageName,
            ports: [
              {
                containerPort: config.api.port,
              },
            ],
            resources: {
              limits: {
                memory: '1Gi',
              },
            },
            commands: ['yarn'],
            args: ['run', 'start:api'],
            envs: getEnv(),
          },
        ],
        containerConcurrency: 50,
      },
    },
  });
  new gcp.cloudrun.IamMember('api-everyone', {
    service: service.name,
    location,
    role: 'roles/run.invoker',
    member: 'allUsers',
  });
  return service.statuses[0].url;
}

export const appUrl = createApp();
export const apiUrl = createApi();
