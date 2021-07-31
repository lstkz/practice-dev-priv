import { WorkspaceS3Auth } from 'src/generated';
import S3 from 'aws-sdk/clients/s3';

export class S3Service {
  private s3: S3 = null!;
  private bucketName: string = null!;
  private workspaceId: string = null!;

  init(workspaceId: string, auth: WorkspaceS3Auth) {
    this.s3 = new S3({
      credentials: auth.credentials,
      region: 'eu-central-1',
    });
    this.bucketName = auth.bucketName;
    this.workspaceId = workspaceId;
  }

  async updateFile(fileId: string, content: string) {
    await this.s3
      .upload({
        Bucket: this.bucketName,
        Key: this._getS3Key(fileId),
        Body: content,
      })
      .promise();
  }

  async deleteFile(fileId: string) {
    await this.s3.deleteObject({
      Bucket: this.bucketName,
      Key: this._getS3Key(fileId),
    });
  }

  private _getS3Key(fileId: string) {
    return `cdn/workspace/${this.workspaceId}/${fileId}`;
  }
}
