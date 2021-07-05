import type { editor } from 'monaco-editor';
import { Themer } from './Themer';
import { HighlighResult } from './HighlighterWorker';
import { Monaco } from '../../types';

const DEBUG_TYPE = true;

export class Highlighter {
  private lastDecorations: string[] = [];
  private worker: Worker = null!;

  constructor(
    private monaco: Monaco,
    private editor: editor.IStandaloneCodeEditor,
    private themer: Themer
  ) {
    this.worker = new Worker(
      new URL('./HighlighterWorker.ts', import.meta.url)
    );
    this.worker.addEventListener('message', e => {
      const { classifications, version } = e.data as HighlighResult;
      const currentVersion = this.editor.getModel()?.getVersionId();
      if (currentVersion == null || currentVersion !== version) {
        return;
      }
      const decorations = classifications.map(classification => {
        let className = this.themer.getClassNameForScope(classification.scope);
        if (DEBUG_TYPE) {
          className += ' ' + classification.scope.replaceAll('.', '_');
        }
        return {
          range: new this.monaco.Range(
            classification.startLine,
            classification.start,
            classification.endLine,
            classification.end
          ),
          options: {
            inlineClassName: className,
          },
        };
      });

      this.lastDecorations = this.editor
        .getModel()!
        .deltaDecorations(this.lastDecorations, decorations);
    });
    void this.highlight();
    editor.onDidChangeModelContent(this.highlight);
    editor.onDidChangeModel(this.highlight);
  }

  highlight = async () => {
    const code = this.editor.getValue();
    const currentVersion = this.editor.getModel()?.getVersionId();
    if (currentVersion == null) {
      return;
    }
    this.worker.postMessage({
      lang: 'ts',
      code,
      version: currentVersion,
    });
  };

  dispose() {
    this.worker.terminate();
  }
}
