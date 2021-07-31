import loader from '@monaco-editor/loader';
import { createModuleContext, useActions, useImmer } from 'context-api';
import React from 'react';
import { LibraryDep } from 'src/types';
import { usePreventEditorNavigation } from './usePreventEditorNavigation';
import { Workspace, WorkspaceNode, WorkspaceNodeType } from 'src/generated';
import { APIService } from './APIService';
import { useApolloClient } from '@apollo/client';
import { useModelState } from './useModelState';
import { createCodeEditor, TreeNode, WorkspaceModel } from 'code-editor';
import { IFRAME_ORIGIN } from 'src/config';

interface Actions {
  load: (container: HTMLDivElement) => void;
  registerPreviewIFrame: (iframe: HTMLIFrameElement) => void;
}

interface State {
  isLoaded: boolean;
}

interface FinalState extends State {
  workspaceModel: WorkspaceModel;
}

const [Provider, useContext] = createModuleContext<FinalState, Actions>();

interface EditorModuleProps {
  challengeId: number;
  children: React.ReactNode;
  workspace: Workspace;
}

const libraries: LibraryDep[] = [
  {
    name: 'react',
    types: 'https://cdn.jsdelivr.net/npm/@types/react@17.0.2/index.d.ts',
    source:
      'https://unpkg.com/@esm-bundle/react@17.0.2/esm/react.development.js',
  },
  {
    name: 'react-dom',
    types: 'https://cdn.jsdelivr.net/npm/@types/react-dom@17.0.2/index.d.ts',
    source:
      'https://unpkg.com/@esm-bundle/react-dom@17.0.2/esm/react-dom.development.js',
  },
];

function useServices(workspace: Workspace, challengeId: number) {
  const client = useApolloClient();
  return React.useMemo(() => {
    const apiService = new APIService(client, workspace.id, workspace.s3Auth);
    return createCodeEditor({
      apiService,
      challengeId,
      iframeOrigin: IFRAME_ORIGIN,
    });
  }, []);
}

function mapWorkspaceNodes(nodes: WorkspaceNode[]) {
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
      };
    }
  });
  return ret;
}

export function EditorModule(props: EditorModuleProps) {
  const { challengeId, children, workspace } = props;
  const [state, setState] = useImmer<State>(
    {
      isLoaded: false,
    },
    'EditorModule'
  );
  const { codeEditor, workspaceModel, browserPreviewService } = useServices(
    workspace,
    challengeId
  );

  const actions = useActions<Actions>({
    load: async container => {
      const monaco = await loader.init();
      codeEditor.init(monaco, container);
      await Promise.all(
        libraries.map(lib => codeEditor.addLib(lib.name, lib.types))
      );
      await browserPreviewService.waitForLoad();
      browserPreviewService.setLibraries(libraries);
      const fileHashMap = new Map<string, string>();
      workspace.items.forEach(item => {
        fileHashMap.set(item.id, item.hash);
      });
      await workspaceModel.init({
        fileHashMap,
        nodes: mapWorkspaceNodes(workspace.items),
        workspaceId: workspace.id,
      });
      setState(draft => {
        draft.isLoaded = true;
      });
    },
    registerPreviewIFrame: iframe => {
      browserPreviewService.load(iframe);
    },
  });
  const { dirtyMap } = useModelState(workspaceModel.getModelState());
  usePreventEditorNavigation(dirtyMap);
  React.useEffect(() => {
    return () => {
      workspaceModel.dispose();
      codeEditor.dispose();
      browserPreviewService.dispose();
    };
  }, []);

  return (
    <Provider state={{ ...state, workspaceModel }} actions={actions}>
      {children}
    </Provider>
  );
}

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
