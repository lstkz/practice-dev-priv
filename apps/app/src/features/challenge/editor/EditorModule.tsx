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
  // openFile: (id: string) => void;
  // closeFile: (id: string) => void;
  // addNew: (values: TreeNode) => void;
  // removeNode: (id: string) => void;
  // renameNode: (id: string, name: string) => void;
  registerPreviewIFrame: (iframe: HTMLIFrameElement) => void;
}

// interface OpenedTab {
//   id: string;
//   name: string;
// }

interface State {
  isLoaded: boolean;
  // activeTabId: string | null;
  // nodes: TreeNode[];
  // tabs: OpenedTab[];
  // dirtyMap: Record<string, boolean>;
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

// function mapWorkspaceNodes(nodes: WorkspaceNode[]) {
//   const ret: TreeNode[] = nodes.map(node => {
//     if (node.type === WorkspaceNodeType.Directory) {
//       return {
//         type: 'directory',
//         id: node.id,
//         name: node.name,
//         parentId: node.parentId,
//       };
//     } else {
//       return {
//         type: 'file',
//         id: node.id,
//         name: node.name,
//         parentId: node.parentId,
//       };
//     }
//   });
//   return ret;
// }

export function EditorModule(props: EditorModuleProps) {
  const { challengeId, children, workspace } = props;
  const [state, setState] = useImmer<State>(
    {
      // activeTabId: null,
      isLoaded: false,
      // nodes: [],
      // tabs: [],
      // dirtyMap: {},
    },
    'EditorModule'
  );
  const client = useApolloClient();
  const codeEditor = React.useMemo(() => new CodeEditor(), []);
  const apiService = React.useMemo(
    () => new APIService(client, workspace.id, workspace.s3Auth),
    []
  );
  const editorStateService = React.useMemo(
    () => new EditorStateService(challengeId),
    []
  );
  const browserPreviewService = React.useMemo(
    () => new BrowserPreviewService(),
    []
  );
  const bundlerService = React.useMemo(
    () => new BundlerService(browserPreviewService, codeEditor),
    []
  );
  const workspaceModel = React.useMemo(
    () =>
      new WorkspaceModel(
        codeEditor,
        apiService,
        editorStateService,
        bundlerService
      ),
    []
  );

  // const syncTabs = () => {
  //   const { activeTabId, tabs } = getState();
  //   editorStateService.updateTabsState({
  //     activeTabId,
  //     tabs,
  //   });
  // };

  // const getNodeById = (id: string) => {
  //   const { nodes } = getState();
  //   return nodes.find(x => x.id === id)!;
  // };

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
      // s3Service.init(workspace.id, workspace.s3Auth);
      // const tabsState = editorStateService.loadTabsState();
      // const nodes = mapWorkspaceNodes(workspace.items);
      // await browserPreviewService.waitForLoad();
      // browserPreviewService.setLibraries(libraries);
      // const pathHelper = new FileTreeHelper(nodes);
      // await Promise.all(
      //   nodes.map(async node => {
      //     if (node.type === 'file') {
      //       codeEditor.addFile({
      //         id: node.id,
      //         path: pathHelper.getPath(node.id),
      //         source: await fetch(
      //           workspace.items.find(x => x.id === node.id)!.url +
      //             '?c=' +
      //             Date.now()
      //         ).then(x => x.text()),
      //       });
      //     }
      //   })
      // );
      // bundlerService.init();
      // bundlerService.setInputFile('./index.tsx');
      // bundlerService.loadCode();
      // codeEditor.addEventListener('modified', ({ fileId, hasChanges }) => {
      //   setState(draft => {
      //     if (hasChanges) {
      //       draft.dirtyMap[fileId] = hasChanges;
      //     } else {
      //       delete draft.dirtyMap[fileId];
      //     }
      //   });
      // });
      // codeEditor.addEventListener('saved', ({ fileId, content }) => {
      //   setState(draft => {
      //     delete draft.dirtyMap[fileId];
      //   });
      //   void s3Service.updateFile(fileId, content);
      //   // void fileService.saveFile(fileId, content);
      //   bundlerService.loadCode();
      // });
      // if (tabsState.activeTabId) {
      //   codeEditor.openFile(tabsState.activeTabId);
      // }
      // setState(draft => {
      //   draft.isLoaded = true;
      //   draft.nodes = nodes;
      //   draft.tabs = tabsState.tabs;
      //   draft.activeTabId = tabsState.activeTabId;
      // });
    },
    // openFile: id => {
    // const file = getNodeById(id);
    // setState(draft => {
    //   draft.activeTabId = id;
    //   if (!draft.tabs.some(x => x.id === id)) {
    //     draft.tabs.push({
    //       id: id,
    //       name: file.name,
    //     });
    //   }
    // });
    // codeEditor.openFile(id);
    // syncTabs();
    // },
    // closeFile: id => {
    // let newActiveId: string | null | -1 = -1;
    // setState(draft => {
    //   draft.tabs = draft.tabs.filter(x => x.id !== id);
    //   if (draft.activeTabId === id) {
    //     draft.activeTabId = draft.tabs[0]?.id ?? null;
    //     newActiveId = draft.activeTabId;
    //   }
    // });
    // if (newActiveId !== -1) {
    //   codeEditor.openFile(newActiveId);
    // }
    // const { dirtyMap } = getState();
    // if (dirtyMap[id]) {
    //   setState(draft => {
    //     delete draft.dirtyMap[id];
    //   });
    //   codeEditor.revertDirty(id);
    // }
    // syncTabs();
    // },
    // addNew: values => {
    // const newNode = fileService.addNew(values);
    // setState(draft => {
    //   draft.nodes.push(newNode);
    // });
    // if (values.type === 'directory') {
    //   return;
    // }
    // const pathHelper = new FileTreeHelper(getState().nodes);
    // codeEditor.addFile({
    //   id: values.id,
    //   path: pathHelper.getPath(values.id),
    //   source: '',
    // });
    // actions.openFile(values.id);
    // requestAnimationFrame(() => {
    //   codeEditor.focus();
    // });
    // },
    // removeNode: id => {
    // const node = getNodeById(id);
    // const nodesToRemove = doFn(() => {
    //   if (node.type === 'directory') {
    //     const treeHelper = new FileTreeHelper(getState().nodes);
    //     return treeHelper.flattenDirectory(id);
    //   }
    //   return [node];
    // });
    // fileService.removeMultiple(nodesToRemove.map(x => x.id));
    // nodesToRemove.forEach(node => {
    //   if (node.type === 'file') {
    //     codeEditor.removeFile(node.id);
    //   }
    // });
    // const removedMap = R.indexBy(nodesToRemove, x => x.id);
    // setState(draft => {
    //   if (draft.activeTabId && removedMap[draft.activeTabId]) {
    //     draft.activeTabId = null;
    //   }
    //   draft.tabs = draft.tabs.filter(x => !removedMap[x.id]);
    //   if (!draft.activeTabId && draft.tabs.length) {
    //     draft.activeTabId = draft.tabs[0].id;
    //   }
    //   draft.nodes = draft.nodes.filter(x => !removedMap[x.id]);
    // });
    // codeEditor.openFile(getState().activeTabId);
    // syncTabs();
    // },
    // renameNode: (id, name) => {
    // fileService.renameNode(id, name);
    // setState(draft => {
    //   draft.nodes.forEach(item => {
    //     if (item.id === id) {
    //       item.name = name;
    //     }
    //   });
    //   draft.tabs.forEach(item => {
    //     if (item.id === id) {
    //       item.name = name;
    //     }
    //   });
    // });
    // const treeHelper = new FileTreeHelper(getState().nodes);
    // const renameNodes = treeHelper.flattenDirectory(id);
    // renameNodes.forEach(node => {
    //   if (node.type === 'file') {
    //     codeEditor.changeFilePath(node.id, treeHelper.getPath(node.id));
    //   }
    // });
    // },
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
      bundlerService.dispose();
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
