import { LibraryDep } from 'src/types';

export class BrowserPreviewService {
  private iframe: HTMLIFrameElement = null!;
  private markLoaded: () => void = null!;
  private loadedPromise: Promise<void> = null!;
  private importMap: Record<string, string> = {};

  constructor() {
    this.loadedPromise = new Promise<void>(resolve => {
      this.markLoaded = resolve;
    });
  }

  load(iframe: HTMLIFrameElement) {
    this.iframe = iframe;
    this.markLoaded();
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
    const body = this.iframe.contentDocument!.body;
    if (!body.querySelector('#root')) {
      this.iframe.contentDocument!.body.innerHTML = `<div id="root"></div>`;
    }
    const head = this.iframe.contentDocument!.head;
    if (!head.querySelector('#__importmap')) {
      const importScript = document.createElement('script');
      importScript.setAttribute('type', 'importmap');
      importScript.setAttribute('id', '__importmap');
      importScript.innerHTML = JSON.stringify(
        {
          imports: this.importMap,
        },
        null,
        2
      );
      head.append(importScript);
    }
    const existing = head.querySelector('#__app');
    if (existing) {
      existing.remove();
    }
    const script = document.createElement('script');
    script.setAttribute('type', 'module');
    script.setAttribute('id', '__app');
    script.innerHTML = code;
    head.append(script);
  }
}
