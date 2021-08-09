import loader from '@monaco-editor/loader';
import { Monaco } from 'src/types';

export class MonacoLoader {
  monaco: Monaco = null!;

  async init() {
    this.monaco = await loader.init();
  }

  getMonaco() {
    if (!this.monaco) {
      throw new Error('Monaco not loaded');
    }
    return this.monaco;
  }
}
