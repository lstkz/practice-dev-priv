import { CDN_BASE_URL } from 'src/config';
import * as R from 'remeda';
import {
  CreateWorkspaceNodeDocument,
  CreateWorkspaceNodeInput,
  CreateWorkspaceNodeMutation,
  CreateWorkspaceNodeMutationVariables,
  DeleteWorkspaceNodeDocument,
  DeleteWorkspaceNodeMutation,
  DeleteWorkspaceNodeMutationVariables,
  UpdateWorkspaceNodeDocument,
  UpdateWorkspaceNodeInput,
  UpdateWorkspaceNodeMutation,
  UpdateWorkspaceNodeMutationVariables,
  WorkspaceS3Auth,
} from 'src/generated';
import S3 from 'aws-sdk/clients/s3';
import { ApolloClient, gql } from '@apollo/client';
import { doFn } from 'src/common/helper';

gql`
  mutation UpdateWorkspaceNode($values: UpdateWorkspaceNodeInput!) {
    updateWorkspaceNode(values: $values)
  }
`;

gql`
  mutation DeleteWorkspaceNode($id: String!) {
    deleteWorkspaceNode(id: $id)
  }
`;

gql`
  mutation CreateWorkspaceNode($values: CreateWorkspaceNodeInput!) {
    createWorkspaceNode(values: $values)
  }
`;

export class APIService {
  private s3: S3 = null!;
  private bucketName: string = null!;

  constructor(
    private client: ApolloClient<any>,
    private workspaceId: string,
    auth: WorkspaceS3Auth
  ) {
    this.s3 = new S3({
      credentials: auth.credentials,
      region: 'eu-central-1',
    });
    this.bucketName = auth.bucketName;
  }

  async getFileContent(options: {
    workspaceId: string;
    fileId: string;
    hash: string;
  }) {
    const { workspaceId, fileId, hash } = options;
    const url = `${CDN_BASE_URL}/workspace/${workspaceId}/${fileId}?h=${hash}`;
    return fetch(url).then(x => x.text());
  }

  async addNode(values: CreateWorkspaceNodeInput) {
    await this.client.mutate<
      CreateWorkspaceNodeMutation,
      CreateWorkspaceNodeMutationVariables
    >({
      mutation: CreateWorkspaceNodeDocument,
      variables: {
        values,
      },
    });
  }

  async deleteNode(nodeId: string) {
    await Promise.all([
      this.s3.deleteObject({
        Bucket: this.bucketName,
        Key: this._getS3Key(nodeId),
      }),
      this.client.mutate<
        DeleteWorkspaceNodeMutation,
        DeleteWorkspaceNodeMutationVariables
      >({
        mutation: DeleteWorkspaceNodeDocument,
        variables: {
          id: nodeId,
        },
      }),
    ]);
  }

  async updateNode(values: UpdateWorkspaceNodeInput & { content?: string }) {
    await Promise.all([
      doFn(async () => {
        if (values.content) {
          await this.s3
            .upload({
              Bucket: this.bucketName,
              Key: this._getS3Key(values.id),
              Body: values.content,
            })
            .promise();
        }
      }),
      doFn(async () => {
        const other = R.omit(values, ['content']);
        if (Object.values(other).length > 1) {
          await this.client.mutate<
            UpdateWorkspaceNodeMutation,
            UpdateWorkspaceNodeMutationVariables
          >({
            mutation: UpdateWorkspaceNodeDocument,
            variables: {
              values: other,
            },
          });
        }
      }),
    ]);
  }

  private _getS3Key(fileId: string) {
    return `cdn/workspace/${this.workspaceId}/${fileId}`;
  }
}
