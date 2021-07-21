import { LibraryDep } from 'src/types';

export class BrowserPreviewService {
  private iframe: HTMLIFrameElement = null!;
  private markLoaded: () => void = null!;
  private loadedPromise: Promise<void> = null!;
  private importMap: Record<string, string> = {};
  private lastInjectedCode: string | null = null;

  constructor() {
    this.loadedPromise = new Promise<void>(resolve => {
      this.markLoaded = resolve;
    });
  }

  load(iframe: HTMLIFrameElement) {
    this.iframe = iframe;
    this.markLoaded();

    window.addEventListener('message', e => {
      const { type } = e.data;
      switch (type) {
        case 'hard-reload': {
          if (!this.iframe || !this.lastInjectedCode) {
            return;
          }
          this.inject(this.lastInjectedCode);
          break;
        }
      }
    });
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
    this.iframe.contentWindow!.postMessage(
      {
        type: 'inject',
        payload: { code, importMap: this.importMap },
      },
      '*'
    );
  }
}
