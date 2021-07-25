import { FormatterAction, FormatterCallbackAction, Monaco } from '../../types';

interface CallbackDefer {
  resolve: (code: string) => void;
  reject: (err: any) => void;
}

export class Formatter {
  private worker: Worker = null!;
  private version = 0;
  private deferMap: Record<number, CallbackDefer> = {};

  constructor(private monaco: Monaco) {
    this.worker = new Worker(new URL('./FormatterWorker.ts', import.meta.url));
    this.worker.addEventListener('message', e => {
      const action = e.data as FormatterCallbackAction;
      const { version } = action.payload;
      const defer = this.deferMap[version];
      delete this.deferMap[version];
      switch (action.type) {
        case 'error': {
          const { error } = action.payload;
          defer.reject(error);
          break;
        }
        case 'highlight': {
          const { code } = action.payload;
          defer.resolve(code ?? '');
          break;
        }
      }
    });

    this.monaco.languages.registerDocumentFormattingEditProvider('typescript', {
      provideDocumentFormattingEdits: async model => {
        return [
          {
            text: await this.formatCode('typescript', model.getValue()),
            range: model.getFullModelRange(),
          },
        ];
      },
    });
  }

  dispose() {
    this.worker.terminate();
  }

  formatCode(lang: string, code: string) {
    return new Promise<string>((resolve, reject) => {
      const version = ++this.version;
      this.deferMap[version] = {
        reject,
        resolve,
      };
      this.sendMessage({
        type: 'format',
        payload: { lang, code, version },
      });
    });
  }

  private sendMessage(action: FormatterAction) {
    this.worker.postMessage(action);
  }
}
