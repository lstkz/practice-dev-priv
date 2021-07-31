import loader from '@monaco-editor/loader';
import { createModuleContext, useActions, useImmer } from 'context-api';
import React from 'react';
import { CodeEditor } from 'src/components/CodeEditor/CodeEditor';
import { EditorStateService } from './EditorStateService';
import { LibraryDep } from 'src/types';
import { usePreventEditorNavigation } from './usePreventEditorNavigation';
import { BrowserPreviewService } from './BrowserPreviewService';
import { BundlerService } from './BundlerService';
import { Workspace } from 'src/generated';
import { WorkspaceModel } from './WorkspaceTreeModel';
import { APIService } from './APIService';
import { useApolloClient } from '@apollo/client';
import { useModelState } from './useModelState';

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
    const codeEditor = new CodeEditor();
    const apiService = new APIService(client, workspace.id, workspace.s3Auth);
    const editorStateService = new EditorStateService(challengeId);
    const browserPreviewService = new BrowserPreviewService();
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
    return {
      codeEditor,
      apiService,
      editorStateService,
      browserPreviewService,
      bundlerService,
      workspaceModel,
    };
  }, []);
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
      await workspaceModel.init(workspace);
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
