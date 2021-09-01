import Path from 'path';
import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';
import * as awsx from '@pulumi/awsx';
import { getMaybeStagePasswordEnv, config } from 'config';

function createTester() {
  const lambdaLogging = new aws.iam.Policy('pd-lambda-logging', {
    path: '/',
    description: 'IAM policy for logging from a lambda',
    policy: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:*:*:*",
      "Effect": "Allow"
    }
  ]
}
`,
  });
  const testerRole = new aws.iam.Role('pd-tester-role', {
    assumeRolePolicy: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'sts:AssumeRole',
          Principal: {
            Service: 'lambda.amazonaws.com',
          },
          Effect: 'Allow',
          Sid: '',
        },
      ],
    },
  });
  const lambdaLogs = new aws.iam.RolePolicyAttachment('pd-lambda-tester-logs', {
    role: testerRole.name,
    policyArn: lambdaLogging.arn,
  });
  const lambdaLayer = new aws.lambda.LayerVersion('pd-tester-layer', {
    compatibleRuntimes: [aws.lambda.Runtime.NodeJS14dX],
    code: new pulumi.asset.FileArchive(Path.join(__dirname, 'tester-layer')),
    layerName: 'pd-tester-layer',
  });
  const lambda = new aws.lambda.Function(
    'pd-tester',
    {
      code: new pulumi.asset.FileArchive(
        Path.join(__dirname, '../apps/tester/build')
      ),
      memorySize: 1024,
      timeout: 60 * 5,
      handler: 'tester-lambda.testerHandler',
      runtime: aws.lambda.Runtime.NodeJS14dX,
      role: testerRole.arn,
      layers: [lambdaLayer.arn],
      environment: {
        variables: {
          IS_AWS: '1',
        },
      },
    },
    {
      dependsOn: [lambdaLogs],
    }
  );
  return lambda;
}

function createBucketCDN() {
  const cfIdentity = new aws.cloudfront.OriginAccessIdentity(
    'CloudFrontOriginAccessIdentity'
  );
  const mainBucket = new aws.s3.Bucket('pd-main-bucket', {
    corsRules: [
      {
        allowedOrigins: ['*'],
        allowedMethods: ['POST', 'GET', 'PUT', 'DELETE', 'HEAD'],
        allowedHeaders: ['*'],
      },
    ],
  });
  const s3Policy = pulumi
    .all([cfIdentity.iamArn, mainBucket.arn])
    .apply(([iamArn, bucketArn]) =>
      aws.iam
        .getPolicyDocument({
          statements: [
            {
              effect: 'Allow',
              actions: ['s3:GetObject*', 's3:GetBucket*', 's3:List*'],
              resources: [bucketArn, bucketArn + '/*'],
              principals: [
                {
                  type: 'AWS',
                  identifiers: [iamArn],
                },
              ],
            },
          ],
        })
        .then(x => x.json)
    );
  new aws.s3.BucketPolicy('bucketPolicy', {
    bucket: mainBucket.id,
    policy: s3Policy,
  });

  const distribution = new aws.cloudfront.Distribution('pd-cdn', {
    enabled: true,
    origins: [
      {
        originPath: '/cdn',
        domainName: mainBucket.bucketRegionalDomainName,
        originId: mainBucket.arn,
        s3OriginConfig: {
          originAccessIdentity: cfIdentity.cloudfrontAccessIdentityPath,
        },
      },
    ],
    restrictions: {
      geoRestriction: {
        restrictionType: 'none',
      },
    },
    priceClass: 'PriceClass_100',
    httpVersion: 'http2',
    isIpv6Enabled: true,
    defaultCacheBehavior: {
      allowedMethods: ['GET', 'HEAD', 'OPTIONS'],
      cachedMethods: ['GET', 'HEAD', 'OPTIONS'],
      viewerProtocolPolicy: 'redirect-to-https',
      targetOriginId: mainBucket.arn,
      forwardedValues: {
        queryString: false,
        headers: [
          'Origin',
          'Access-Control-Request-Headers',
          'Access-Control-Request-Method',
        ],
        cookies: {
          forward: 'none',
        },
      },
      compress: true,
    },
    orderedCacheBehaviors: [],
    viewerCertificate: {
      acmCertificateArn: config.deploy.cdn.certArn,
      minimumProtocolVersion: 'TLSv1.2_2019',
      sslSupportMethod: 'sni-only',
    },
    aliases: [config.deploy.cdn.domainName],
  });
  new aws.route53.Record('cdn-record', {
    zoneId: config.deploy.zone.hostedZoneId,
    name: config.deploy.cdn.domainName,
    type: 'A',
    aliases: [
      {
        name: distribution.domainName,
        zoneId: distribution.hostedZoneId,
        evaluateTargetHealth: true,
      },
    ],
  });

  const iframeDistribution = new aws.cloudfront.Distribution('pd-iframe', {
    enabled: true,
    defaultRootObject: 'index.html',
    origins: [
      {
        originPath: '/iframe',
        domainName: mainBucket.bucketRegionalDomainName,
        originId: mainBucket.arn,
        s3OriginConfig: {
          originAccessIdentity: cfIdentity.cloudfrontAccessIdentityPath,
        },
      },
    ],
    customErrorResponses: [
      {
        errorCode: 403,
        errorCachingMinTtl: 1,
        responsePagePath: '/index.html',
        responseCode: 200,
      },
    ],
    restrictions: {
      geoRestriction: {
        restrictionType: 'none',
      },
    },
    priceClass: 'PriceClass_100',
    httpVersion: 'http2',
    isIpv6Enabled: true,
    defaultCacheBehavior: {
      allowedMethods: ['GET', 'HEAD', 'OPTIONS'],
      cachedMethods: ['GET', 'HEAD', 'OPTIONS'],
      viewerProtocolPolicy: 'redirect-to-https',
      targetOriginId: mainBucket.arn,
      forwardedValues: {
        queryString: false,
        headers: [
          'Origin',
          'Access-Control-Request-Headers',
          'Access-Control-Request-Method',
        ],
        cookies: {
          forward: 'none',
        },
      },
      compress: true,
    },
    orderedCacheBehaviors: [],
    viewerCertificate: {
      acmCertificateArn: config.deploy.iframe.certArn,
      minimumProtocolVersion: 'TLSv1.2_2019',
      sslSupportMethod: 'sni-only',
    },
    aliases: [config.deploy.iframe.domainName],
  });
  new aws.route53.Record('iframe-record', {
    zoneId: config.deploy.zone.hostedZoneId,
    name: config.deploy.iframe.domainName,
    type: 'A',
    aliases: [
      {
        name: iframeDistribution.domainName,
        zoneId: iframeDistribution.hostedZoneId,
        evaluateTargetHealth: true,
      },
    ],
  });

  return { mainBucket, distribution };
}

function createBucketRole(mainBucket: aws.s3.Bucket) {
  const role = new aws.iam.Role('bucket-role', {
    assumeRolePolicy: {
      Version: '2012-10-17',
      Statement: aws.getCallerIdentity({}).then(x => [
        {
          Principal: {
            AWS: `arn:aws:iam::${x.accountId}:root`,
          },
          Action: 'sts:AssumeRole',
          Effect: 'Allow',
        },
      ]),
    },
    inlinePolicies: [
      {
        name: 'p1',
        policy: mainBucket.arn.apply(arn =>
          JSON.stringify({
            Version: '2012-10-17',
            Statement: [
              {
                Resource: [arn, arn + '/*'],
                Action: ['s3:*'],
                Effect: 'Allow',
              },
            ],
          })
        ),
      },
    ],
  });
  return role.arn;
}

function createApp(mainBucket: aws.s3.Bucket) {
  const vpc = awsx.ec2.Vpc.getDefault();
  const sgGroup = new awsx.ec2.SecurityGroup('pd-lb-sg', {
    vpc: vpc,
    ingress: [
      {
        fromPort: 443,
        toPort: 443,
        protocol: 'tcp',
        cidrBlocks: [vpc.vpc.cidrBlock],
        // ipv6CidrBlocks: [vpc.vpc.ipv6CidrBlock],
      },
      {
        fromPort: 80,
        toPort: 80,
        protocol: 'tcp',
        cidrBlocks: [vpc.vpc.cidrBlock],
        // ipv6CidrBlocks: [vpc.vpc.ipv6CidrBlock],
      },
    ],
    egress: [
      {
        fromPort: 0,
        toPort: 0,
        protocol: '-1',
        cidrBlocks: ['0.0.0.0/0'],
        ipv6CidrBlocks: ['::/0'],
      },
    ],
  });
  const loadBalancer = new awsx.elasticloadbalancingv2.ApplicationLoadBalancer(
    'pd-lb',
    {
      vpc,

      securityGroups: [sgGroup],
    }
  );
  const lbListener = loadBalancer.createListener('HttpsListener', {
    protocol: 'HTTPS',
    certificateArn: config.deploy.lbCertArn,
    defaultAction: {
      type: 'fixed-response',
      fixedResponse: {
        contentType: 'text/plain',
        statusCode: '200',
        messageBody: 'ok',
      },
    },
  });

  loadBalancer.createListener('HttpListener', {
    protocol: 'HTTP',
    defaultAction: {
      type: 'redirect',
      redirect: {
        protocol: 'HTTPS',
        port: '443',
        statusCode: 'HTTP_301',
      },
    },
  });

  const webEnv: Record<string, string> = getMaybeStagePasswordEnv();
  const environment = Object.keys(webEnv).map(name => ({
    name,
    value: webEnv[name],
  }));
  const cluster = new awsx.ecs.Cluster('pd_cluster', {
    vpc,
  });
  const image = awsx.ecs.Image.fromPath('all', Path.join(__dirname, '../'));
  const apiGroup = new awsx.elasticloadbalancingv2.ApplicationTargetGroup(
    'ApiGroup',
    {
      vpc,
      loadBalancer: loadBalancer,
      deregistrationDelay: 10,
      protocol: 'HTTP',
      port: config.api.port,
      stickiness: {
        enabled: false,
        cookieDuration: 60 * 2,
        type: 'lb_cookie',
      },
      healthCheck: {
        path: '/rpc/ping',
        timeout: 4,
        interval: 20,
        healthyThreshold: 2,
      },
    }
  );
  const taskRole = new aws.iam.Role('task-role', {
    assumeRolePolicy: {
      Version: '2012-10-17',
      Statement: [
        {
          Principal: {
            Service: 'ecs-tasks.amazonaws.com',
          },
          Action: 'sts:AssumeRole',
          Effect: 'Allow',
        },
      ],
    },
    inlinePolicies: [
      {
        name: 'p1',
        policy: mainBucket.arn.apply(arn =>
          JSON.stringify({
            Version: '2012-10-17',
            Statement: [
              {
                Resource: [arn, arn + '/*'],
                Action: ['s3:*'],
                Effect: 'Allow',
              },
            ],
          })
        ),
      },
      {
        name: 'p2',
        policy: JSON.stringify({
          Version: '2012-10-17',
          Statement: [
            {
              Resource: '*',
              Action: ['sts:*'],
              Effect: 'Allow',
            },
          ],
        }),
      },
      {
        name: 'p3',
        policy: JSON.stringify({
          Version: '2012-10-17',
          Statement: [
            {
              Resource: '*',
              Action: ['lambda:InvokeFunction'],
              Effect: 'Allow',
            },
          ],
        }),
      },
    ],
  });
  new awsx.ecs.FargateService('api', {
    cluster,
    desiredCount: config.deploy.api.count,
    healthCheckGracePeriodSeconds: 60,
    taskDefinitionArgs: {
      memory: config.deploy.api.memory.toString(),
      cpu: config.deploy.api.cpu.toString(),
      vpc,
      taskRole: taskRole,
      containers: {
        api: {
          command: ['yarn', 'run', 'start:api'],
          image,
          portMappings: [apiGroup],
          environment,
        },
      },
    },
  });
  lbListener.addListenerRule('ApiListenerRule', {
    actions: [
      {
        type: 'forward',
        targetGroupArn: apiGroup.targetGroup.arn,
      },
    ],
    conditions: [
      {
        hostHeader: { values: [config.deploy.lbDomain] },
      },
      {
        pathPattern: {
          values: ['/rpc/*', '/socket', '/track/*'],
        },
      },
    ],
    priority: 10,
  });

  const webGroup = new awsx.elasticloadbalancingv2.ApplicationTargetGroup(
    'WebGroup',
    {
      vpc,
      loadBalancer: loadBalancer,
      deregistrationDelay: 10,
      protocol: 'HTTP',
      port: config.web.port,
      stickiness: {
        enabled: false,
        cookieDuration: 60 * 2,
        type: 'lb_cookie',
      },
      healthCheck: {
        path: '/',
        timeout: 4,
        interval: 5,
        healthyThreshold: 2,
      },
    }
  );
  new awsx.ecs.FargateService('web', {
    cluster,
    desiredCount: config.deploy.web.count,
    healthCheckGracePeriodSeconds: 20,
    taskDefinitionArgs: {
      memory: config.deploy.web.memory.toString(),
      cpu: config.deploy.web.cpu.toString(),
      vpc,
      containers: {
        web: {
          command: ['yarn', 'run', 'start:app'],
          image,
          portMappings: [webGroup],
          environment,
        },
      },
    },
  });
  lbListener.addListenerRule('WebListenerRule', {
    actions: [
      {
        type: 'forward',
        targetGroupArn: webGroup.targetGroup.arn,
      },
    ],
    conditions: [
      {
        hostHeader: { values: [config.deploy.lbDomain] },
      },
    ],
    priority: 20,
  });

  new awsx.ecs.FargateService('worker', {
    cluster,
    desiredCount: config.deploy.worker.count,
    taskDefinitionArgs: {
      memory: config.deploy.worker.memory.toString(),
      cpu: config.deploy.worker.cpu.toString(),
      vpc,
      taskRole: taskRole,
      containers: {
        worker: {
          command: ['yarn', 'run', 'start:worker'],
          image,
          environment,
        },
      },
    },
  });

  new aws.route53.Record('main-record', {
    zoneId: config.deploy.zone.hostedZoneId,
    name: config.deploy.zone.zoneName,
    type: 'A',
    aliases: [
      {
        name: loadBalancer.loadBalancer.dnsName,
        zoneId: loadBalancer.loadBalancer.zoneId,
        evaluateTargetHealth: true,
      },
    ],
  });

  // const taskPolicy = new aws.iam.PolicyStatement();
  return { appUrl: `https://${config.deploy.zone.zoneName}/` };
}

const { distribution, mainBucket } = createBucketCDN();
const testerLambda = createTester();
export const { appUrl } = createApp(mainBucket);
export const bucketRoleArn = createBucketRole(mainBucket);

export const bucketName = mainBucket.bucket;
export const cdnDomain = distribution.domainName;
export const testerLambdaName = testerLambda.name;
