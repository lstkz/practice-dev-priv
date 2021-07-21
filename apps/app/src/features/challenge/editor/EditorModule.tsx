import loader from '@monaco-editor/loader';
import * as R from 'remeda';
import { createModuleContext, useActions, useImmer } from 'context-api';
import React from 'react';
import { CodeEditor } from 'src/components/CodeEditor/CodeEditor';
import { FileService } from './FileService';
import { EditorStateService } from './EditorStateService';
import { TreeNode } from 'src/types';
import { doFn } from 'src/common/helper';
import { FileTreeHelper } from 'src/common/tree';

interface Actions {
  load: (container: HTMLDivElement) => void;
  openFile: (id: string) => void;
  closeFile: (id: string) => void;
  addNew: (values: TreeNode) => void;
  removeNode: (id: string) => void;
  renameNode: (id: string, name: string) => void;
}

interface OpenedTab {
  id: string;
  name: string;
}

interface State {
  activeTabId: string | null;
  isLoaded: boolean;
  nodes: TreeNode[];
  tabs: OpenedTab[];
  dirtyMap: Record<string, boolean>;
}

const [Provider, useContext] = createModuleContext<State, Actions>();

interface EditorModuleProps {
  challengeId: number;
  children: React.ReactNode;
}

export function EditorModule(props: EditorModuleProps) {
  const { challengeId, children } = props;
  const [state, setState, getState] = useImmer<State>(
    {
      activeTabId: null,
      isLoaded: false,
      nodes: [],
      tabs: [],
      dirtyMap: {},
    },
    'EditorModule'
  );
  const codeEditor = React.useMemo(() => new CodeEditor(), []);
  const fileService = React.useMemo(() => new FileService(challengeId), []);
  const editorStateService = React.useMemo(
    () => new EditorStateService(challengeId),
    []
  );

  const syncTabs = () => {
    const { activeTabId, tabs } = getState();
    editorStateService.updateTabsState({
      activeTabId,
      tabs,
    });
  };

  const getNodeById = (id: string) => {
    const { nodes } = getState();
    return nodes.find(x => x.id === id)!;
  };

  const actions = useActions<Actions>({
    load: async container => {
      const monaco = await loader.init();
      codeEditor.init(monaco, container);
      await Promise.all([
        codeEditor.addLib(
          'react',
          'https://cdn.jsdelivr.net/npm/@types/react@17.0.2/index.d.ts'
        ),
        codeEditor.addLib(
          'react-dom',
          'https://cdn.jsdelivr.net/npm/@types/react-dom@17.0.2/index.d.ts'
        ),
      ]);
      const tabsState = editorStateService.loadTabsState();
      const nodes = await fileService.loadNodes();
      const pathHelper = new FileTreeHelper(nodes);
      await Promise.all(
        nodes.map(async node => {
          if (node.type === 'file') {
            codeEditor.addFile({
              id: node.id,
              path: pathHelper.getPath(node.id),
              source: await fileService.loadFileContent(node.id),
            });
          }
        })
      );
      codeEditor.addEventListener('modified', ({ fileId, hasChanges }) => {
        setState(draft => {
          if (hasChanges) {
            draft.dirtyMap[fileId] = hasChanges;
          } else {
            delete draft.dirtyMap[fileId];
          }
        });
      });
      codeEditor.addEventListener('saved', ({ fileId, content }) => {
        setState(draft => {
          delete draft.dirtyMap[fileId];
        });
        void fileService.saveFile(fileId, content);
      });
      if (tabsState.activeTabId) {
        codeEditor.openFile(tabsState.activeTabId);
      }
      setState(draft => {
        draft.isLoaded = true;
        draft.nodes = nodes;
        draft.tabs = tabsState.tabs;
        draft.activeTabId = tabsState.activeTabId;
      });
    },
    openFile: id => {
      const file = getNodeById(id);
      setState(draft => {
        draft.activeTabId = id;
        if (!draft.tabs.some(x => x.id === id)) {
          draft.tabs.push({
            id: id,
            name: file.name,
          });
        }
      });
      codeEditor.openFile(id);
      syncTabs();
    },
    closeFile: id => {
      let newActiveId: string | null | -1 = -1;
      setState(draft => {
        draft.tabs = draft.tabs.filter(x => x.id !== id);
        if (draft.activeTabId === id) {
          draft.activeTabId = draft.tabs[0]?.id ?? null;
          newActiveId = draft.activeTabId;
        }
      });
      if (newActiveId !== -1) {
        codeEditor.openFile(newActiveId);
      }
      syncTabs();
    },
    addNew: values => {
      const newNode = fileService.addNew(values);
      setState(draft => {
        draft.nodes.push(newNode);
      });
      if (values.type === 'directory') {
        return;
      }
      const pathHelper = new FileTreeHelper(getState().nodes);
      codeEditor.addFile({
        id: values.id,
        path: pathHelper.getPath(values.id),
        source: '',
      });
      actions.openFile(values.id);
      requestAnimationFrame(() => {
        codeEditor.focus();
      });
    },
    removeNode: id => {
      const node = getNodeById(id);
      const nodesToRemove = doFn(() => {
        if (node.type === 'directory') {
          const treeHelper = new FileTreeHelper(getState().nodes);
          return treeHelper.flattenDirectory(id);
        }
        return [node];
      });
      fileService.removeMultiple(nodesToRemove.map(x => x.id));
      nodesToRemove.forEach(node => {
        if (node.type === 'file') {
          codeEditor.removeFile(node.id);
        }
      });
      const removedMap = R.indexBy(nodesToRemove, x => x.id);
      setState(draft => {
        if (draft.activeTabId && removedMap[draft.activeTabId]) {
          draft.activeTabId = null;
        }
        draft.tabs = draft.tabs.filter(x => !removedMap[x.id]);
        if (!draft.activeTabId && draft.tabs.length) {
          draft.activeTabId = draft.tabs[0].id;
        }
        draft.nodes = draft.nodes.filter(x => !removedMap[x.id]);
      });
      codeEditor.openFile(getState().activeTabId);
      syncTabs();
    },
    renameNode: (id, name) => {
      fileService.renameNode(id, name);
      setState(draft => {
        draft.nodes.forEach(item => {
          if (item.id === id) {
            item.name = name;
          }
        });
        draft.tabs.forEach(item => {
          if (item.id === id) {
            item.name = name;
          }
        });
      });
      const treeHelper = new FileTreeHelper(getState().nodes);
      const renameNodes = treeHelper.flattenDirectory(id);
      renameNodes.forEach(node => {
        if (node.type === 'file') {
          codeEditor.changeFilePath(node.id, treeHelper.getPath(node.id));
        }
      });
    },
  });

  React.useEffect(() => {
    return () => {
      codeEditor.dispose();
    };
  }, []);

  return (
    <Provider state={state} actions={actions}>
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
