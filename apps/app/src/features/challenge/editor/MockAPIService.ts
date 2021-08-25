import { IAPIService } from 'code-editor';

export class MockAPIService implements IAPIService {
  async addNode() {
    throw new Error('Not supported');
  }
  async deleteNode() {
    throw new Error('Not supported');
  }
  async getFileContent(): Promise<string> {
    throw new Error('Not supported');
  }
  async updateNode() {
    throw new Error('Not supported');
  }
  async uploadIndexFile(): Promise<string> {
    throw new Error('Not supported');
  }
  updateAuth() {
    throw new Error('Not supported');
  }
  updateWorkspaceId() {
    throw new Error('Not supported');
  }
}
