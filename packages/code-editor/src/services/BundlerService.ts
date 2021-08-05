import { CodeEditor } from '../CodeEditor';
import { BundlerAction, BundlerCallbackAction, SourceCode } from '../types';
import { BrowserPreviewService } from './BrowserPreviewService';

export interface BundleOptions {
  input: string;
  modules: Record<string, SourceCode>;
}

interface CallbackDefer {
  resolve: (code: string) => void;
  reject: (err: any) => void;
}

export class BundlerService {
  private inputFile: string | null = null;
  private worker: Worker = null!;
  private version = 1;
  private defer: CallbackDefer = null!;

  constructor(
    private browserPreviewService: BrowserPreviewService,
    private codeEditor: CodeEditor
  ) {}

  init() {
    this.worker = new Worker(
      new URL('./BundlerService.worker.ts', import.meta.url)
    );
    this.worker.addEventListener('message', e => {
      const action = e.data as BundlerCallbackAction;
      const { version } = action.payload;
      if (this.version !== version || !this.defer) {
        return;
      }
      switch (action.type) {
        case 'bundled': {
          const { code } = action.payload;
          this.defer.resolve(code);
          break;
        }
        case 'error': {
          const { error } = action.payload;
          this.defer.reject(error);
          break;
        }
      }
    });
  }
  private async bundle(options: BundleOptions): Promise<string> {
    const version = ++this.version;
    return new Promise<string>((resolve, reject) => {
      this.defer = {
        resolve,
        reject,
      };
      this.sendMessage({
        type: 'bundle',
        payload: {
          ...options,
          version,
        },
      });
    });
  }

  dispose() {
    this.worker.terminate();
  }

  setInputFile(inputFile: string) {
    this.inputFile = inputFile;
  }

  loadCode() {
    this.loadCodeAsync().catch(e => {
      this.browserPreviewService.showError(e);
    });
  }

  private sendMessage(action: BundlerAction) {
    this.worker.postMessage(action);
  }

  async loadCodeAsync() {
    if (!this.inputFile) {
      throw new Error('inputFile not set');
    }
    const fileMap = this.codeEditor.getFileMap();
    const code = await this.bundle({
      input: this.inputFile,
      modules: fileMap,
    });
    await this.browserPreviewService.inject(code);
    return code;
  }
}
