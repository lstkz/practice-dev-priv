import type { editor } from 'monaco-editor';
import { ThemeService } from './ThemeService';
import { HighlighterAction, HighlighterCallbackAction, Monaco } from '../types';

const DEBUG_TYPE = process.env.NODE_ENV === 'development';

export class HighlighterService {
  private lastDecorations: Record<string, string[]> = {};
  private worker: Worker = null!;

  constructor(
    private monaco: Monaco,
    private editor: editor.IStandaloneCodeEditor,
    private themer: ThemeService
  ) {
    this.worker = new Worker(
      new URL('./HighlighterService.worker.ts', import.meta.url)
    );
    this.worker.addEventListener('message', e => {
      const action = e.data as HighlighterCallbackAction;
      const { classifications, version } = action.payload;
      const model = this.editor.getModel();
      if (!model) {
        return;
      }
      const currentVersion = model.getVersionId();
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

      this.lastDecorations[model.id] = model.deltaDecorations(
        this.lastDecorations[model.id],
        decorations
      );
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
    this.sendMessage({
      type: 'highlight',
      payload: {
        lang: 'ts',
        code,
        version: currentVersion,
      },
    });
  };

  dispose() {
    this.worker.terminate();
  }

  private sendMessage(action: HighlighterAction) {
    this.worker.postMessage(action);
  }
}
