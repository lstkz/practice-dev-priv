import * as docker from '@pulumi/docker';
import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';
import { config, getMaybeStagePasswordEnv } from '../packages/config';

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

export const bucketName = mainBucket.bucket;
export const cdnDomain = distribution.domainName;
