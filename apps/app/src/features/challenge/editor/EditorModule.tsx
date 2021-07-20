import loader from '@monaco-editor/loader';
import * as R from 'remeda';
import { createModuleContext, useActions, useImmer } from 'context-api';
import React from 'react';
import { CodeEditor } from 'src/components/CodeEditor/CodeEditor';
import { ElementInfo, FileInfo, FileService } from './FileService';

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
  activeFile: string | null;
  isLoaded: boolean;
  elements: ElementInfo[];
  tabs: OpenedTab[];
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
      activeFile: null,
      isLoaded: false,
      elements: [],
      tabs: [],
    },
    'EditorModule'
  );
  const codeEditor = React.useMemo(() => new CodeEditor(), []);
  const fileService = React.useMemo(() => new FileService(challengeId), []);

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
      setState(draft => {
        draft.isLoaded = true;
        draft.elements = elements;
      });
    },
    openFile: id => {
      const { elements } = getState();
      const file = elements.find(x => x.id === id) as FileInfo;
      setState(draft => {
        draft.activeFile = id;
        if (!draft.tabs.some(x => x.id === id)) {
          draft.tabs.push({
            id: id,
            name: file.name,
          });
        }
      });
      codeEditor.openFile(id);
    },
    closeFile: id => {
      let newActiveId: string | null | -1 = -1;
      setState(draft => {
        draft.tabs = draft.tabs.filter(x => x.id !== id);
        if (draft.activeFile === id) {
          draft.activeFile = draft.tabs[0]?.id ?? null;
          newActiveId = draft.activeFile;
        }
      });
      if (newActiveId !== -1) {
        codeEditor.openFile(newActiveId);
      }
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
