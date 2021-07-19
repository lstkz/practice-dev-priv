import loader from '@monaco-editor/loader';
import { createModuleContext, useActions, useImmer } from 'context-api';
import React from 'react';
import { CodeEditor } from 'src/components/CodeEditor/CodeEditor';
import { ElementInfo, FileService } from './FileService';

interface Actions {
  load: (container: HTMLDivElement) => void;
}

interface State {
  isLoaded: boolean;
  elements: ElementInfo[];
}

const [Provider, useContext] = createModuleContext<State, Actions>();

interface EditorModuleProps {
  challengeId: number;
  children: React.ReactNode;
}

export function EditorModule(props: EditorModuleProps) {
  const { challengeId, children } = props;
  const [state, setState] = useImmer<State>(
    {
      isLoaded: false,
      elements: [],
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
      elements.forEach(element => {
        if (element.type === 'file') {
          codeEditor.addFile(element.name, element.content, element.id === '1');
        }
      });
      setState(draft => {
        draft.isLoaded = true;
        draft.elements = elements;
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
