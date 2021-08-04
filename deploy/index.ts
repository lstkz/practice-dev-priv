import Path from 'path';
import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';

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
