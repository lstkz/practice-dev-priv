import loader from '@monaco-editor/loader';
import { createModuleContext, useActions, useImmer } from 'context-api';
import React from 'react';
import { usePreventEditorNavigation } from './usePreventEditorNavigation';
import {
  Challenge,
  Workspace,
  WorkspaceNode,
  WorkspaceNodeType,
} from 'src/generated';
import { APIService } from './APIService';
import { useApolloClient } from '@apollo/client';
import { useModelState } from './useModelState';
import { createCodeEditor, TreeNode, WorkspaceModel } from 'code-editor';
import { IFRAME_ORIGIN } from 'src/config';
import { useErrorModalActions } from 'src/features/ErrorModalModule';
import { useChallengeActions } from '../ChallengeModule';
import { useTesterActions } from '../TesterModule';
import { convertCodeToHtml } from './convertCodeToHTML';

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
}

interface FinalState extends State {
  workspaceModel: WorkspaceModel;
}

const [Provider, useContext] = createModuleContext<FinalState, Actions>();

interface EditorModuleProps {
  challenge: Challenge;
  children: React.ReactNode;
  workspace: Workspace;
}

function useServices(workspace: Workspace, challengeId: string) {
  const client = useApolloClient();
  return React.useMemo(() => {
    const apiService = new APIService(client, workspace.id, workspace.s3Auth);
    return {
      ...createCodeEditor({
        apiService,
        challengeId,
        iframeOrigin: IFRAME_ORIGIN,
      }),
      apiService,
    };
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
  const { challenge, children, workspace } = props;
  const [state, setState] = useImmer<State>(
    {
      isLoaded: false,
      isSubmitting: false,
      workspace,
      challenge,
    },
    'EditorModule'
  );
  const {
    codeEditor,
    workspaceModel,
    browserPreviewService,
    bundlerService,
    apiService,
  } = useServices(workspace, challenge.id);
  const { showError } = useErrorModalActions();
  const { setLeftSidebarTab } = useChallengeActions();
  const { submit: testerSubmit } = useTesterActions();

  const actions = useActions<Actions>({
    load: async container => {
      const monaco = await loader.init();
      codeEditor.init(monaco, container);
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
