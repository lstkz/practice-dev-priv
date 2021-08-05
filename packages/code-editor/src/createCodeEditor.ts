import { CodeEditor } from './CodeEditor';
import { WorkspaceModel } from './models/WorkspaceModel';
import { BrowserPreviewService } from './services/BrowserPreviewService';
import { BundlerService } from './services/BundlerService';
import { EditorStateService } from './services/EditorStateService';
import { IAPIService } from './types';

interface CreateCodeEditorOptions {
  apiService: IAPIService;
  challengeId: string;
  iframeOrigin: string;
}

export function createCodeEditor(options: CreateCodeEditorOptions) {
  const { apiService, challengeId, iframeOrigin } = options;
  const codeEditor = new CodeEditor();
  const editorStateService = new EditorStateService(challengeId);
  const browserPreviewService = new BrowserPreviewService(iframeOrigin);
  const bundlerService = new BundlerService(browserPreviewService, codeEditor);
  const workspaceModel = new WorkspaceModel(
    codeEditor,
    apiService,
    editorStateService,
    bundlerService
  );
  return {
    codeEditor,
    apiService,
    editorStateService,
    browserPreviewService,
    bundlerService,
    workspaceModel,
  };
}
