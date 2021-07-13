import { BundlerResponse, SourceCode } from './Bundler.worker';

export interface BundleOptions {
  input: string;
  modules: Record<string, SourceCode>;
}

export class Bundler {
  private worker: Worker = null!;
  private version = 1;
  private resolve: ((code: string) => void) | null = null;

  constructor() {
    this.worker = new Worker(new URL('./Bundler.worker.ts', import.meta.url));

    this.worker.addEventListener('message', e => {
      const { code, version } = e.data as BundlerResponse;
      if (this.version === version && this.resolve) {
        this.resolve(code);
        this.resolve = null;
      }
    });
  }

  async bundle(options: BundleOptions): Promise<string> {
    this.version++;
    this.worker.postMessage({
      ...options,
      version: this.version,
    });
    return new Promise(resolve => {
      this.resolve = resolve;
    });
  }

  dispose() {
    this.worker.terminate();
  }
}
