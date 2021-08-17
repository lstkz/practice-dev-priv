import { createModuleContext, useActions, useImmer } from 'context-api';
import React from 'react';
import { usePreventEditorNavigation } from './usePreventEditorNavigation';
import { APIService } from './APIService';
import { useModelState } from './useModelState';
import {
  IWorkspaceModel,
  TreeNode,
  WorkspaceModelNext,
  BundlerService,
  BrowserPreviewService,
  EditorStateService,
  EditorFactory,
  CodeEditorModel,
  FormatterService,
  ModelCollection,
  CodeActionsCallbackMap,
  HighlighterService,
  ThemeService,
  EditorCreator,
} from 'code-editor';
import { CDN_BASE_URL, IFRAME_ORIGIN } from 'src/config';
import { useErrorModalActions } from 'src/features/ErrorModalModule';
import { useChallengeActions } from '../ChallengeModule';
import { useTesterActions } from '../TesterModule';
import { convertCodeToHtml } from './convertCodeToHtml';
import {
  ChallengeDetails,
  ReadOnlyWorkspace,
  Workspace,
  WorkspaceNode,
  WorkspaceNodeType,
} from 'shared';
import { MonacoLoader } from './MonacoLoader';
import { migrateTabState } from './migrateTabState';
import { MockAPIService } from './MockAPIService';

interface Actions {
  load: (container: HTMLDivElement) => void;
  registerPreviewIFrame: (iframe: HTMLIFrameElement) => void;
  submit: () => void;
}

interface State {
  isLoaded: boolean;
  isSubmitting: boolean;
  workspace: Workspace;
  challenge: ChallengeDetails;
  mode: 'default' | 'readOnly';
}

interface FinalState extends State {
  workspaceModel: IWorkspaceModel;
}

const [Provider, useContext] = createModuleContext<FinalState, Actions>();

interface EditorModuleProps {
  challenge: ChallengeDetails;
  children: React.ReactNode;
  workspace: Workspace;
  noWorkspaceInit?: boolean;
}

function useServices(workspace: Workspace, challengeId: string) {
  return React.useMemo(() => {
    const apiService = workspace
      ? new APIService(workspace.id, workspace.s3Auth)
      : new MockAPIService();
    const editorStateService = new EditorStateService(challengeId);
    const browserPreviewService = new BrowserPreviewService(IFRAME_ORIGIN);

    const creator = new EditorCreator(
      apiService,
      browserPreviewService,
      editorStateService
    );
    const editorFactory = new EditorFactory();
    const monacoLoader = new MonacoLoader();
    return {
      editorFactory,
      monacoLoader,
      apiService,
      editorStateService,
      browserPreviewService,
      creator,
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
  closeReadOnlyWorkspace: () => void;
  openNewWorkspace: (newWorkspace: Workspace) => void;
}

function _getFileHashMap(workspace: Workspace) {
  const fileHashMap = new Map<string, string>();
  workspace.items.forEach(item => {
    fileHashMap.set(item.id, item.hash);
  });
  return fileHashMap;
}

export const EditorModule = React.forwardRef<
  EditorModuleRef,
  EditorModuleProps
>((props, ref) => {
  const { challenge, children, noWorkspaceInit } = props;
  const [state, setState, getState] = useImmer<State>(
    {
      isLoaded: false,
      isSubmitting: false,
      workspace: props.workspace,
      challenge,
      mode: 'default',
    },
    'EditorModule'
  );
  const {
    editorFactory,
    monacoLoader,
    apiService,
    browserPreviewService,
    creator,
  } = useServices(props.workspace, challenge.id);
  const { workspaceModel, themeService } = creator;
  const loadedDefer = React.useMemo(() => {
    let resolve: () => void = null!;
    const promise = new Promise<void>(_resolve => {
      resolve = _resolve;
    });
    return {
      promise,
      resolve,
    };
  }, []);
  React.useEffect(() => {
    if (getState().isLoaded) {
      loadedDefer.resolve();
    }
  }, [state.isLoaded]);
  const { showError } = useErrorModalActions();
  const { setLeftSidebarTab } = useChallengeActions();
  const { submit: testerSubmit } = useTesterActions();

  const initWorkspace = () => {
    const { workspace } = getState();
    return workspaceModel.init({
      fileHashMap: _getFileHashMap(workspace),
      nodes: mapWorkspaceNodes(workspace.id, workspace.items, 'workspace'),
      workspaceId: workspace.id,
    });
  };

  const actions = useActions<Actions>({
    load: async container => {
      const { workspace } = getState();
      await monacoLoader.init();
      const monaco = monacoLoader.getMonaco();
      editorFactory.init(monaco, container);
      themeService.init();
      creator.init(monaco, editorFactory.create());
      // bundlerService.init();
      // highlighterService.init(monaco);
      // codeEditor.init(monaco, editorFactory);
      await Promise.all(
        workspace.libraries.map(lib =>
          creator.modelCollection.addLib(lib.name, lib.types)
        )
      );
      await browserPreviewService.waitForLoad();
      browserPreviewService.setLibraries(workspace.libraries);
      if (!noWorkspaceInit) {
        await initWorkspace();
      }
      setState(draft => {
        draft.isLoaded = true;
      });
    },
    registerPreviewIFrame: iframe => {
      browserPreviewService.load(iframe);
    },
    submit: async () => {
      // const { workspace } = getState();
      // try {
      //   setState(draft => {
      //     draft.isSubmitting = true;
      //   });
      //   workspaceModel.setReadOnly(true);
      //   setLeftSidebarTab('test-suite');
      //   const data = await workspaceModel.getBundledCode();
      //   const html = convertCodeToHtml(data, workspace.libraries);
      //   const indexHtmlS3Key = await apiService.uploadIndexFile(html);
      //   await testerSubmit(indexHtmlS3Key);
      // } catch (e) {
      //   showError(e);
      // } finally {
      //   workspaceModel.setReadOnly(false);
      //   setState(draft => {
      //     draft.isSubmitting = false;
      //   });
      // }
    },
  });

  React.useImperativeHandle(
    ref,
    () => ({
      openReadOnlyWorkspace: async (workspace: ReadOnlyWorkspace) => {
        // await loadedDefer.promise;
        // readOnlyCodeEditor.disposeModels();
        // if (getState().mode === 'default') {
        //   codeEditor.makeModelBackup();
        //   codeEditor.disposeModels();
        // }
        // const monaco = monacoLoader.getMonaco();
        // readOnlyCodeEditor.init(monaco, editorFactory);
        // await readOnlyWorkspaceModel.init({
        //   defaultOpenFiles: ['./App.tsx'],
        //   nodes: mapWorkspaceNodes(workspace.id, workspace.items, 'submission'),
        // });
        // setState(draft => {
        //   draft.mode = 'readOnly';
        // });
      },
      closeReadOnlyWorkspace: async () => {
        // readOnlyCodeEditor.disposeModels();
        // if (workspaceModel.getIsInited()) {
        //   codeEditor.restoreModelBackup();
        //   workspaceModel.loadCode();
        // } else {
        //   await initWorkspace();
        // }
        // workspaceModel.setReadOnly(false);
        // setState(draft => {
        //   draft.mode = 'default';
        // });
      },
      openNewWorkspace: async newWorkspace => {
        // readOnlyCodeEditor.disposeModels();
        // const newNodes = mapWorkspaceNodes(
        //   newWorkspace.id,
        //   newWorkspace.items,
        //   'workspace'
        // );
        // const tabState = migrateTabState({
        //   tabState: readOnlyWorkspaceModel.getModelState().state,
        //   newNodes,
        //   nodes: readOnlyWorkspaceModel.getModelState().state.nodes,
        //   defaultNodePath: 'App.tsx',
        // });
        // editorStateService.updateTabsState(tabState);
        // workspaceModel.setReadOnly(false);
        // await workspaceModel.reload({
        //   fileHashMap: _getFileHashMap(newWorkspace),
        //   nodes: newNodes,
        //   workspaceId: newWorkspace.id,
        // });
        // setState(draft => {
        //   draft.mode = 'default';
        //   draft.workspace = newWorkspace;
        // });
      },
    }),
    []
  );

  const { dirtyMap } = useModelState(workspaceModel.getModelState());
  usePreventEditorNavigation(dirtyMap);
  React.useEffect(() => {
    return () => {
      creator.dispose();
    };
  }, []);
  return (
    <Provider
      state={{
        ...state,
        workspaceModel,
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
