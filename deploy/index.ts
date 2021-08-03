import Path from 'path';
import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';

function createTester() {
  const docsHandlerRole = new aws.iam.Role('testerRole', {
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
  const lambdaLayer = new aws.lambda.LayerVersion('tester_layer', {
    compatibleRuntimes: [aws.lambda.Runtime.NodeJS14dX],
    code: new pulumi.asset.FileArchive(Path.join(__dirname, 'tester-layer')),
    layerName: 'tester_layer',
  });
  const lambda = new aws.lambda.Function('tester', {
    code: new pulumi.asset.FileArchive(
      Path.join(__dirname, '../apps/tester/build')
    ),
    memorySize: 1024,
    timeout: 60 * 5,
    handler: 'tester-lambda.testerHandler',
    runtime: aws.lambda.Runtime.NodeJS14dX,
    role: docsHandlerRole.arn,
    layers: [lambdaLayer.arn],
  });
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
      cloudfrontDefaultCertificate: true,
    },
  });

  return { mainBucket, distribution };
}

const { distribution, mainBucket } = createBucketCDN();
const testerLambda = createTester();

export const bucketName = mainBucket.bucket;
export const cdnDomain = distribution.domainName;
export const testerLambdaName = testerLambda.name;
