import { BundlerAction, BundlerCallbackAction, SourceCode } from 'src/types';

export interface BundleOptions {
  input: string;
  modules: Record<string, SourceCode>;
}

interface CallbackDefer {
  resolve: (code: string) => void;
  reject: (err: any) => void;
}

export class Bundler {
  private worker: Worker = null!;
  private version = 1;
  private defer: CallbackDefer = null!;

  constructor() {
    this.worker = new Worker(new URL('./Bundler.worker.ts', import.meta.url));
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

  async bundle(options: BundleOptions): Promise<string> {
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

  private sendMessage(action: BundlerAction) {
    this.worker.postMessage(action);
  }
}
