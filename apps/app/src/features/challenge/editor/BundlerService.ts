import { CodeEditor } from 'src/components/CodeEditor/CodeEditor';
import { BrowserPreviewService } from './BrowserPreviewService';
import { Bundler } from './Bundler';

export class BundlerService {
  private bundler: Bundler = null!;
  private inputFile: string | null = null;

  constructor(
    private browserPreviewService: BrowserPreviewService,
    private codeEditor: CodeEditor
  ) {}

  init() {
    this.bundler = new Bundler();
  }

  setInputFile(inputFile: string) {
    this.inputFile = inputFile;
  }

  loadCode() {
    this.loadCodeAsync().catch(e => {
      console.error('failed to load code', e);
    });
  }

  dispose() {
    this.bundler.dispose();
  }

  private async loadCodeAsync() {
    if (!this.inputFile) {
      throw new Error('inputFile not set');
    }
    const fileMap = this.codeEditor.getFileMap();
    const code = await this.bundler.bundle({
      input: this.inputFile,
      modules: fileMap,
    });
    await this.browserPreviewService.inject(code);
  }
}
