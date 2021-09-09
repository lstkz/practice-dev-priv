import { APIClient, AwsUploadContentAuth } from 'shared';
import AWS, { S3 } from 'aws-sdk';
import fs from 'fs';
import Path from 'path';
import mime from 'mime-types';
import { walk } from './helper';

const token = process.env.PD_ADMIN_TOKEN;
const url = process.env.PD_API_URL || 'http://localhost:3001';
if (!token) {
  throw new Error('PD_ADMIN_TOKEN is not set');
}

const api = new APIClient(url, () => token);

interface UploadS3Options {
  content: string | Buffer;
  contentType?: string;
  s3Key: string;
  cacheControl?: S3.CacheControl;
}

export class S3Upload {
  private s3: S3;
  private bucketName: string;

  constructor(auth: AwsUploadContentAuth) {
    this.s3 = new AWS.S3({
      credentials: auth.credentials,
    });
    this.bucketName = auth.bucketName;
  }

  async upload(options: UploadS3Options) {
    const { content, contentType, s3Key, cacheControl } = options;
    const exists = await this.s3
      .headObject({
        Bucket: this.bucketName,
        Key: s3Key,
      })
      .promise()
      .then(
        () => true,
        err => {
          if (err.code === 'NotFound') {
            return false;
          }
          throw err;
        }
      );

    if (!exists) {
      await this.s3
        .upload({
          Bucket: this.bucketName,
          Key: s3Key,
          Body: content,
          ContentType: contentType,
          ContentLength: content.length,
          CacheControl: cacheControl,
        })
        .promise();
    }

    return s3Key;
  }
}

async function upload() {
  const s3Upload = new S3Upload(await api.aws_getAwsUploadContentAuth());
  const baseDir = Path.join(__dirname, 'libs');
  const files = walk(baseDir);
  await Promise.all(
    files.map(async file => {
      const relative = Path.relative(baseDir, file);
      await s3Upload.upload({
        content: fs.readFileSync(file),
        s3Key: `cdn/npm/${relative}`,
        contentType: mime.lookup(file) || undefined,
        cacheControl: 'public, max-age=31536000, s-maxage=31536000, immutable',
      });
    })
  );
}

void upload();
