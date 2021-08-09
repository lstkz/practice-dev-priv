import { createModuleContext, useActions, useImmer } from 'context-api';
import React from 'react';
import { usePreventEditorNavigation } from './usePreventEditorNavigation';
import { APIService } from './APIService';
import { useModelState } from './useModelState';
import {
  IWorkspaceModel,
  ReadOnlyWorkspaceModel,
  TreeNode,
  WorkspaceModel,
} from 'code-editor';
import { CDN_BASE_URL, IFRAME_ORIGIN } from 'src/config';
import { useErrorModalActions } from 'src/features/ErrorModalModule';
import { useChallengeActions } from '../ChallengeModule';
import { useTesterActions } from '../TesterModule';
import { convertCodeToHtml } from './convertCodeToHtml';
import {
  Challenge,
  ReadOnlyWorkspace,
  Workspace,
  WorkspaceNode,
  WorkspaceNodeType,
} from 'shared';
import { CodeEditor } from 'code-editor/src/CodeEditor';
import { EditorStateService } from 'code-editor/src/services/EditorStateService';
import { BrowserPreviewService } from 'code-editor/src/services/BrowserPreviewService';
import { BundlerService } from 'code-editor/src/services/BundlerService';
import { EditorFactory } from 'code-editor/src/EditorFactory';
import { MonacoLoader } from './MonacoLoader';

interface Actions {
  load: (container: HTMLDivElement) => void;
  registerPreviewIFrame: (iframe: HTMLIFrameElement) => void;
  submit: () => void;
}

interface State {
  isLoaded: boolean;
  isSubmitting: boolean;
  workspace: Workspace;
  challenge: Challenge;
  mode: 'default' | 'readOnly';
}

interface FinalState extends State {
  workspaceModel: IWorkspaceModel;
}

const [Provider, useContext] = createModuleContext<FinalState, Actions>();

interface EditorModuleProps {
  challenge: Challenge;
  children: React.ReactNode;
  workspace: Workspace;
}

function useServices(workspace: Workspace, challengeId: string) {
  return React.useMemo(() => {
    const apiService = new APIService(workspace.id, workspace.s3Auth);
    const codeEditor = new CodeEditor();
    const readOnlyCodeEditor = new CodeEditor();
    const editorStateService = new EditorStateService(challengeId);
    const browserPreviewService = new BrowserPreviewService(IFRAME_ORIGIN);
    const bundlerService = new BundlerService(
      browserPreviewService,
      codeEditor
    );
    const workspaceModel = new WorkspaceModel(
      codeEditor,
      apiService,
      editorStateService,
      bundlerService
    );
    const readOnlyWorkspaceModel = new ReadOnlyWorkspaceModel(
      readOnlyCodeEditor,
      apiService,
      bundlerService
    );
    const editorFactory = new EditorFactory();
    const monacoLoader = new MonacoLoader();
    return {
      codeEditor,
      readOnlyCodeEditor,
      editorStateService,
      browserPreviewService,
      bundlerService,
      workspaceModel,
      editorFactory,
      apiService,
      readOnlyWorkspaceModel,
      monacoLoader,
    };
  }, []);
}

function mapWorkspaceNodes(
  id: string,
  nodes: WorkspaceNode[],
  type: 'submission' | 'workspace'
) {
  const ret: TreeNode[] = nodes.map(node => {
    if (node.type === WorkspaceNodeType.Directory) {
      return {
        type: 'directory',
        id: node.id,
        name: node.name,
        parentId: node.parentId,
      };
    } else {
      return {
        type: 'file',
        id: node.id,
        name: node.name,
        parentId: node.parentId,
        contentUrl: `${CDN_BASE_URL}/${type}/${id}/${node.id}`,
      };
    }
  });
  return ret;
}

export interface EditorModuleRef {
  openReadOnlyWorkspace: (workspace: ReadOnlyWorkspace) => void;
}

export const EditorModule = React.forwardRef<
  EditorModuleRef,
  EditorModuleProps
>((props, ref) => {
  const { challenge, children, workspace } = props;
  const [state, setState] = useImmer<State>(
    {
      isLoaded: false,
      isSubmitting: false,
      workspace,
      challenge,
      mode: 'default',
    },
    'EditorModule'
  );
  const {
    readOnlyCodeEditor,
    codeEditor,
    workspaceModel,
    readOnlyWorkspaceModel,
    browserPreviewService,
    bundlerService,
    apiService,
    editorFactory,
    monacoLoader,
  } = useServices(workspace, challenge.id);
  const { showError } = useErrorModalActions();
  const { setLeftSidebarTab } = useChallengeActions();
  const { submit: testerSubmit } = useTesterActions();

  const actions = useActions<Actions>({
    load: async container => {
      await monacoLoader.init();
      const monaco = monacoLoader.getMonaco();
      editorFactory.init(monaco, container);
      codeEditor.init(monaco, editorFactory);
      await Promise.all(
        workspace.libraries.map(lib => codeEditor.addLib(lib.name, lib.types))
      );
      await browserPreviewService.waitForLoad();
      browserPreviewService.setLibraries(workspace.libraries);
      const fileHashMap = new Map<string, string>();
      workspace.items.forEach(item => {
        fileHashMap.set(item.id, item.hash);
      });
      await workspaceModel.init({
        fileHashMap,
        nodes: mapWorkspaceNodes(workspace.id, workspace.items, 'workspace'),
        workspaceId: workspace.id,
      });
      setState(draft => {
        draft.isLoaded = true;
      });
    },
    registerPreviewIFrame: iframe => {
      browserPreviewService.load(iframe);
    },
    submit: async () => {
      try {
        setState(draft => {
          draft.isSubmitting = true;
        });
        workspaceModel.setReadOnly(true);
        setLeftSidebarTab('test-suite');
        const code = await bundlerService.loadCodeAsync();
        const html = convertCodeToHtml(code, workspace.libraries);
        const indexHtmlS3Key = await apiService.uploadIndexFile(html);
        await testerSubmit(indexHtmlS3Key);
      } catch (e) {
        showError(e);
      } finally {
        workspaceModel.setReadOnly(false);
        setState(draft => {
          draft.isSubmitting = false;
        });
      }
    },
  });

  React.useImperativeHandle(
    ref,
    () => ({
      openReadOnlyWorkspace: async (workspace: ReadOnlyWorkspace) => {
        readOnlyCodeEditor.disposeModels();
        codeEditor.disposeModels();
        const monaco = monacoLoader.getMonaco();
        readOnlyCodeEditor.init(monaco, editorFactory);
        await readOnlyWorkspaceModel.init({
          defaultOpenFiles: ['./App.tsx'],
          nodes: mapWorkspaceNodes(workspace.id, workspace.items, 'submission'),
        });
        setState(draft => {
          draft.mode = 'readOnly';
        });
      },
    }),
    []
  );

  const { dirtyMap } = useModelState(workspaceModel.getModelState());
  usePreventEditorNavigation(dirtyMap);
  React.useEffect(() => {
    return () => {
      workspaceModel.dispose();
      codeEditor.dispose();
      browserPreviewService.dispose();
    };
  }, []);
  const { mode } = state;
  return (
    <Provider
      state={{
        ...state,
        workspaceModel:
          mode === 'default' ? workspaceModel : readOnlyWorkspaceModel,
      }}
      actions={actions}
    >
      {children}
    </Provider>
  );
});

export function useEditorActions() {
  return useContext().actions;
}

export function useEditorState() {
  return useContext().state;
}

export function useIsEditorLoaded() {
  return useEditorState().isLoaded;
}

export function useWorkspaceModel() {
  return useEditorState().workspaceModel;
}

export function useWorkspaceState() {
  return useModelState(useWorkspaceModel().getModelState());
}
