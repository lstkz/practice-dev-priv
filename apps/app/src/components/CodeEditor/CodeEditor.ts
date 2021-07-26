import type { editor } from 'monaco-editor';
import { Themer } from './Themer';
import DarkThemeNew from './dark-theme-new.json';
import { Highlighter } from './Highlighter';
import { Monaco } from '../../types';
import { CallbackMap, EditorEventEmitter } from './EditorEventEmitter';
import { Formatter } from './Formatter';

export function createEditor(monaco: Monaco, wrapper: HTMLDivElement) {
  monaco.editor.defineTheme('myCustomTheme', {
    base: 'vs-dark',
    inherit: true,
    rules: [],
    colors: {
      'editor.background': '#011627',
    },
  });
  const properties: editor.IStandaloneEditorConstructionOptions = {
    language: 'typescript',
    theme: 'myCustomTheme',
    model: null,
    minimap: {
      enabled: false,
    },
    quickSuggestions: {
      other: true,
      comments: true,
      strings: true,
    },
    automaticLayout: true,
  };
  monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
    target: monaco.languages.typescript.ScriptTarget.Latest,
    allowNonTsExtensions: true,
    moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
    module: monaco.languages.typescript.ModuleKind.CommonJS,
    noEmit: true,
    esModuleInterop: true,
    strict: true,
    jsx: monaco.languages.typescript.JsxEmit.React,
    reactNamespace: 'React',
    allowJs: true,
    isolatedModules: true,
    typeRoots: ['node_modules/@types'],
  });
  monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);
  monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: false,
    noSyntaxValidation: false,
  });

  return monaco.editor.create(wrapper, properties);
}

interface EditorFile {
  id: string;
  path: string;
  source: string;
}

export class CodeEditor {
  private editor: editor.IStandaloneCodeEditor = null!;
  private themer: Themer = null!;
  private formatter: Formatter = null!;
  private highlighter: Highlighter = null!;
  private models: Record<string, editor.ITextModel> = {};
  private modelCommittedText: Record<string, string> = {};
  private monaco: Monaco = null!;
  private activeId: null | string = null;
  private dirtyMap: Record<string, boolean> = {};
  private emitter = new EditorEventEmitter();

  init(monaco: Monaco, wrapper: HTMLDivElement) {
    this.monaco = monaco;
    this.editor = createEditor(monaco, wrapper);
    this.themer = new Themer();
    this.themer.loadTheme(DarkThemeNew as any);
    this.themer.injectStyles();
    this.highlighter = new Highlighter(monaco, this.editor, this.themer);
    this.formatter = new Formatter(monaco);
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
      this.monaco.Uri.parse(file.path)
    );
    this.models[file.id] = model;
    this.modelCommittedText[file.id] = file.source;
  }

  getFileMap() {
    const map: Record<string, { code: string }> = {};
    Object.keys(this.models).forEach(fileId => {
      const model = this.models[fileId];
      const content = this.modelCommittedText[fileId];
      map[model.uri.path.substr(1)] = {
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
      this.monaco.Uri.parse(path)
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
