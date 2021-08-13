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

  async uploadIndexFile(_html: string): Promise<string> {
    throw new Error('Not supported');
  }
}
