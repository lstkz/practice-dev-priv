import type { editor } from 'monaco-editor';
import { Themer } from './Themer';
import DarkThemeNew from './dark-theme-new.json';
import { Highlighter } from './Highlighter';
import { Monaco } from '../../types';

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

export class CodeEditor {
  private editor: editor.IStandaloneCodeEditor = null!;
  private themer: Themer = null!;
  private highlighter: Highlighter = null!;
  private models: Record<string, editor.ITextModel> = {};
  private monaco: Monaco = null!;

  init(monaco: Monaco, wrapper: HTMLDivElement) {
    this.monaco = monaco;
    this.editor = createEditor(monaco, wrapper);
    this.themer = new Themer();
    this.themer.loadTheme(DarkThemeNew as any);
    this.themer.injectStyles();
    this.highlighter = new Highlighter(monaco, this.editor, this.themer);
    this.changeCommandKeybinding(
      'editor.action.triggerSuggest',
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.Space
    );
  }

  async addLib(name: string, url: string) {
    const source = await fetch(url).then(x => x.text());
    this.monaco.editor.createModel(
      source,
      'typescript',
      this.monaco.Uri.parse(`file:///node_modules/${name}/index.d.ts`)
    );
  }

  addFile(fileName: string, source: string, isActive: boolean) {
    const model = this.monaco.editor.createModel(
      source,
      'typescript',
      this.monaco.Uri.parse(fileName)
    );
    if (isActive) {
      this.editor.setModel(model);
    }
    this.models[fileName] = model;
  }

  dispose() {
    this.highlighter.dispose();
    this.monaco.editor.getModels().forEach(model => model.dispose());
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
