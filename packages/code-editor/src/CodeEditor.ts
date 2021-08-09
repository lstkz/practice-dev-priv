import * as R from 'remeda';
import type { editor } from 'monaco-editor';
import { ThemeService } from './services/ThemeService';
import DarkThemeNew from './themes/dark-theme-new.json';
import { HighlighterService } from './services/HighlighterService';
import { MarkerSeverity, Monaco } from './types';
import { FormatterService } from './services/FormatterService';
import { TypedEventEmitter } from './lib/TypedEventEmitter';
import { EditorFactory } from './EditorFactory';

function fixFilePath(path: string) {
  return path.replace(/^\.\//, 'file:///');
}

interface EditorFile {
  id: string;
  path: string;
  source: string;
}

export interface CallbackMap {
  modified: (data: { fileId: string; hasChanges: boolean }) => void;
  saved: (data: { fileId: string; content: string }) => void;
  opened: (data: { fileId: string }) => void;
  errorsChanged: (data: { diffErrorMap: Record<string, boolean> }) => void;
}

export class CodeEditor {
  private editor: editor.IStandaloneCodeEditor = null!;
  private themer: ThemeService = null!;
  private formatter: FormatterService = null!;
  private highlighter: HighlighterService = null!;
  private models: Record<string, editor.ITextModel> = {};
  private modelCommittedText: Record<string, string> = {};
  private monaco: Monaco = null!;
  private activeId: null | string = null;
  private dirtyMap: Record<string, boolean> = {};
  private errorMap: Record<string, boolean> = {};
  private emitter = new TypedEventEmitter<CallbackMap>();

  init(monaco: Monaco, editorFactory: EditorFactory) {
    this.monaco = monaco;
    this.editor = editorFactory.create();
    this.themer = new ThemeService();
    this.themer.loadTheme(DarkThemeNew as any);
    this.themer.injectStyles();
    this.highlighter = new HighlighterService(monaco, this.editor, this.themer);
    this.formatter = new FormatterService(monaco);
    this.changeCommandKeybinding(
      'editor.action.triggerSuggest',
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.Space
    );
    this.editor.onDidChangeModelContent(() => {
      const model = this.editor.getModel();
      if (model && this.activeId) {
        const original = this.modelCommittedText[this.activeId];
        const current = model.getValue();
        const hasChanges = original !== current;
        const isDirty = !!this.dirtyMap[this.activeId];
        if (isDirty !== hasChanges) {
          this.emitter.emit('modified', {
            fileId: this.activeId,
            hasChanges,
          });
          this.dirtyMap[this.activeId] = hasChanges;
        }
      }
    });

    this.editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S, () => {
      const model = this.editor.getModel();
      const activeId = this.activeId;
      if (!model || !activeId) {
        return;
      }
      if (!this.dirtyMap[activeId]) {
        this.saveAllNonActiveFiles();
        return;
      }
      void this.editor
        .getAction('editor.action.formatDocument')
        .run()
        .catch(() => {
          // ignore
        })
        .then(() => {
          this.saveAllNonActiveFiles();
          const content = model.getValue();
          this.modelCommittedText[activeId] = content;
          delete this.dirtyMap[activeId];
          this.emitter.emit('saved', {
            fileId: activeId,
            content,
          });
        });
    });

    const codeEditorService = this.editor._codeEditorService;
    const openEditorBase =
      codeEditorService.openCodeEditor.bind(codeEditorService);
    codeEditorService.openCodeEditor = async (input, source) => {
      const result = await openEditorBase(input, source);
      if (result) {
        return result;
      }
      const model = monaco.editor.getModel(input.resource);
      const fileId = Object.keys(this.models).find(
        fileId => this.models[fileId] === model
      );
      if (!fileId) {
        return result;
      }
      this.editor.setModel(monaco.editor.getModel(input.resource));
      if (input.options?.selection) {
        this.editor.setSelection(input.options.selection);
        this.editor.revealLine(input.options.selection.startLineNumber);
      }
      this.emitter.emit('opened', { fileId });
      return result;
    };

    this.editor.onDidChangeModelDecorations(() => {
      const markers = monaco.editor.getModelMarkers({});
      const currentErrorMap = R.pipe(
        markers,
        R.filter(x => x.severity === MarkerSeverity.Error),
        R.indexBy(x => x.resource.toString())
      );
      const diffErrorMap: Record<string, boolean> = {};
      Object.keys(this.models).forEach(fileId => {
        const model = this.models[fileId];
        const currentHasError = !!currentErrorMap[model.uri.toString()];
        const oldHasError = !!this.errorMap[fileId];
        if (currentHasError != oldHasError) {
          diffErrorMap[fileId] = currentHasError;
        }
      });
      Object.assign(this.errorMap, diffErrorMap);
      if (Object.keys(diffErrorMap).length) {
        this.emitter.emit('errorsChanged', { diffErrorMap });
      }
    });
  }

  addEventListener<T extends keyof CallbackMap>(
    type: T,
    callback: CallbackMap[T]
  ) {
    this.emitter.addEventListener(type, callback);
  }

  async addLib(name: string, url: string) {
    const source = await fetch(url).then(x => x.text());
    this.monaco.editor.createModel(
      source,
      'typescript',
      this.monaco.Uri.parse(`file:///node_modules/${name}/index.d.ts`)
    );
  }

  addFile(file: EditorFile) {
    const model = this.monaco.editor.createModel(
      file.source,
      'typescript',
      this.monaco.Uri.parse(fixFilePath(file.path))
    );
    this.models[file.id] = model;
    this.modelCommittedText[file.id] = file.source;
  }

  getFileMap() {
    const map: Record<string, { code: string }> = {};
    Object.keys(this.models).forEach(fileId => {
      const model = this.models[fileId];
      const content = this.modelCommittedText[fileId];
      map['.' + model.uri.path] = {
        code: content,
      };
    });
    return map;
  }

  focus() {
    this.editor.focus();
  }

  removeFile(fileId: string) {
    const model = this.models[fileId];
    delete this.models[fileId];
    model.dispose();
    if (this.activeId === fileId) {
      this.editor.setModel(null);
      this.activeId = null;
    }
    delete this.dirtyMap[fileId];
  }

  openFile(fileId: string | null) {
    if (this.activeId === fileId) {
      return;
    }
    if (!fileId) {
      this.editor.setModel(null);
    } else {
      this.editor.setModel(this.models[fileId]);
    }
    this.activeId = fileId;
  }

  revertDirty(fileId: string) {
    delete this.dirtyMap[fileId];
    const model = this.models[fileId];
    model.setValue(this.modelCommittedText[fileId]);
  }

  changeFilePath(fileId: string, path: string) {
    const currentModel = this.models[fileId];
    const model = this.monaco.editor.createModel(
      currentModel.getValue(),
      'typescript',
      this.monaco.Uri.parse(fixFilePath(path))
    );
    this.models[fileId] = model;
    if (this.activeId === fileId) {
      this.editor.setModel(model);
    }
    currentModel.dispose();
  }

  dispose() {
    this.highlighter.dispose();
    this.formatter.dispose();
    this.monaco.editor.getModels().forEach(model => model.dispose());
  }

  setReadOnly(readOnly: boolean) {
    this.editor.updateOptions({ readOnly });
  }

  disposeModels() {
    Object.values(this.models).forEach(model => {
      model.dispose();
    });
    this.activeId = null;
  }

  private saveAllNonActiveFiles() {
    // TODO: files are not formatted
    Object.keys(this.models).forEach(modelId => {
      const model = this.models[modelId];
      if (modelId === this.activeId || !this.dirtyMap[modelId]) {
        return;
      }
      delete this.dirtyMap[modelId];
      const content = model.getValue();
      this.emitter.emit('modified', {
        fileId: modelId,
        hasChanges: false,
      });
      this.modelCommittedText[modelId] = content;
      this.emitter.emit('saved', {
        fileId: modelId,
        content,
      });
    });
  }

  private changeCommandKeybinding(id: string, keybinding: number) {
    this.editor._standaloneKeybindingService.addDynamicKeybinding(
      '-' + id,
      undefined,
      () => {}
    );
    const action = this.editor.getAction(id);

    this.editor._standaloneKeybindingService.addDynamicKeybinding(
      id,
      keybinding,
      () => action.run()
    );
  }
}
