import loader from '@monaco-editor/loader';
import * as R from 'remeda';
import { createModuleContext, useActions, useImmer } from 'context-api';
import React from 'react';
import { CodeEditor } from 'src/components/CodeEditor/CodeEditor';
import { ElementInfo, FileInfo, FileService } from './FileService';
import { EditorStateService } from './EditorStateService';

interface Actions {
  load: (container: HTMLDivElement) => void;
  openFile: (id: string) => void;
  closeFile: (id: string) => void;
}

interface OpenedTab {
  id: string;
  name: string;
}

interface State {
  activeTabId: string | null;
  isLoaded: boolean;
  elements: ElementInfo[];
  tabs: OpenedTab[];
  dirtyMap: Record<string, boolean>;
}

const [Provider, useContext] = createModuleContext<State, Actions>();

interface EditorModuleProps {
  challengeId: number;
  children: React.ReactNode;
}

function getPath(id: string, elementMap: Record<string, ElementInfo>) {
  let file = elementMap[id];
  const path = [file.name];
  while (file.parentId) {
    file = elementMap[file.parentId];
    path.unshift(file.name);
  }
  return './' + path.join('/');
}

export function EditorModule(props: EditorModuleProps) {
  const { challengeId, children } = props;
  const [state, setState, getState] = useImmer<State>(
    {
      activeTabId: null,
      isLoaded: false,
      elements: [],
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
      const elements = await fileService.loadElements();
      const elementMap = R.indexBy(elements, x => x.id);
      elements.forEach(element => {
        if (element.type === 'file') {
          codeEditor.addFile({
            id: element.id,
            path: getPath(element.id, elementMap),
            source: element.content,
          });
        }
      });
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
        draft.elements = elements;
        draft.tabs = tabsState.tabs;
        draft.activeTabId = tabsState.activeTabId;
      });
    },
    openFile: id => {
      const { elements } = getState();
      const file = elements.find(x => x.id === id) as FileInfo;
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
