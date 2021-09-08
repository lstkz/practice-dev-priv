import { createModuleContext, useActions, useImmer } from 'context-api';
import React from 'react';
import { usePreventEditorNavigation } from './usePreventEditorNavigation';
import { APIService } from './APIService';
import { useModelState } from './useModelState';
import {
  IWorkspaceModel,
  TreeNode,
  BrowserPreviewService,
  EditorStateService,
  EditorFactory,
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
import { api } from 'src/services/api';
import { useS3Refresh } from './useS3Refresh';
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

function useServices(workspace: Workspace | null, challengeId: string) {
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

function _getFileHashMap(workspace: Workspace | ReadOnlyWorkspace) {
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
  const { workspaceModel, themeService, editorStateService } = creator;
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

  const initWorkspace = (
    workspace: Workspace | ReadOnlyWorkspace,
    type: 'workspace' | 'submission',
    readOnly = false
  ) => {
    return workspaceModel.init({
      defaultOpenFiles: ['./App.tsx'],
      fileHashMap: _getFileHashMap(workspace),
      nodes: mapWorkspaceNodes(workspace.id, workspace.items, type),
      workspaceId: workspace.id,
      readOnly,
    });
  };

  const actions = useActions<Actions>({
    load: async container => {
      if (getState().isLoaded) {
        return;
      }
      const { workspace } = getState();
      await monacoLoader.init();
      const monaco = monacoLoader.getMonaco();
      editorFactory.init(monaco, container);
      themeService.init();
      creator.init(monaco, editorFactory.create());
      await Promise.all(
        workspace.libraries
          .filter(lib => lib.types)
          .map(lib => creator.modelCollection.addLib(lib.name, lib.types))
      );
      await browserPreviewService.waitForLoad();
      browserPreviewService.setLibraries(workspace.libraries);
      if (!noWorkspaceInit) {
        await initWorkspace(workspace, 'workspace');
      }
      setState(draft => {
        draft.isLoaded = true;
      });
    },
    registerPreviewIFrame: iframe => {
      browserPreviewService.load(iframe);
    },
    submit: async () => {
      const { workspace } = getState();
      try {
        setState(draft => {
          draft.isSubmitting = true;
        });
        workspaceModel.setReadOnly(true);
        setLeftSidebarTab('test-suite');
        const data = await workspaceModel.getBundledCode();
        const html = convertCodeToHtml(data, workspace.libraries);
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
        await loadedDefer.promise;
        await initWorkspace(workspace, 'submission', true);

        setState(draft => {
          draft.mode = 'readOnly';
        });
      },
      closeReadOnlyWorkspace: async () => {
        const workspace = await api.workspace_getOrCreateWorkspace({
          challengeId: challenge.id,
        });
        await initWorkspace(workspace, 'workspace');
        setState(draft => {
          draft.mode = 'default';
        });
      },
      openNewWorkspace: async newWorkspace => {
        const newNodes = mapWorkspaceNodes(
          newWorkspace.id,
          newWorkspace.items,
          'workspace'
        );
        const tabState = migrateTabState({
          tabState: workspaceModel.getModelState().state,
          newNodes,
          nodes: workspaceModel.getModelState().state.nodes,
          defaultNodePath: 'App.tsx',
        });
        editorStateService.updateTabsState(tabState);
        apiService.updateAuth(newWorkspace.s3Auth);
        apiService.updateWorkspaceId(newWorkspace.id);
        await initWorkspace(newWorkspace, 'workspace');
        setState(draft => {
          draft.mode = 'default';
          draft.workspace = newWorkspace;
        });
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
  useS3Refresh(state.workspace?.id, apiService);
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
