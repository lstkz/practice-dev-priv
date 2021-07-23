import { IframeCallbackMessage, IframeMessage } from 'shared';
import { IFRAME_ORIGIN } from 'src/config';
import { LibraryDep } from 'src/types';

export class BrowserPreviewService {
  private iframe: HTMLIFrameElement = null!;
  private markLoaded: () => void = null!;
  private loadedPromise: Promise<void> = null!;
  private importMap: Record<string, string> = {};
  private lastInjectedCode: string | null = null;
  private onMessage: (e: MessageEvent<any>) => void = null!;

  constructor() {
    this.loadedPromise = new Promise<void>(resolve => {
      this.markLoaded = resolve;
    });
  }

  load(iframe: HTMLIFrameElement) {
    this.iframe = iframe;
    this.markLoaded();
    this.onMessage = e => {
      if (e.origin !== IFRAME_ORIGIN) {
        return;
      }
      const action = e.data as IframeCallbackMessage;
      if (action.target !== 'preview') {
        return;
      }
      switch (action.type) {
        case 'hard-reload': {
          if (!this.iframe || !this.lastInjectedCode) {
            return;
          }
          this.inject(this.lastInjectedCode);
          break;
        }
      }
    };
    window.addEventListener('message', this.onMessage);
  }

  dispose() {
    window.removeEventListener('message', this.onMessage);
  }

  async waitForLoad() {
    return this.loadedPromise;
  }

  setImportMap(importMap: Record<string, string>) {
    this.importMap = importMap;
  }

  setLibraries(libraries: LibraryDep[]) {
    const map: Record<string, string> = {};
    libraries.forEach(lib => {
      map[lib.name] = lib.source;
    });
    this.importMap = map;
  }

  inject(code: string) {
    this.lastInjectedCode = code;
    this.sendMessage({
      type: 'inject',
      payload: { code, importMap: this.importMap },
    });
  }

  private sendMessage(message: IframeMessage) {
    if (!this.iframe.contentWindow) {
      return;
    }
    this.iframe.contentWindow.postMessage(message, IFRAME_ORIGIN);
  }
}
