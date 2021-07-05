import { useImmer } from 'context-api';
import React from 'react';
import { CodeEditor } from '../../components/CodeEditor/CodeEditor';
import { Monaco } from '../../types';
import loader from '@monaco-editor/loader';

type State = {
  isLoaded: boolean;
  monaco: Monaco;
  types: Record<string, string>;
};

const sampleCode = `
import React from "react";
import ReactDOM from "react-dom";
        
function App() {
  React.useEffect(() => {
    const onClick = () => {
      console.log('click2');
    }
    document.addEventListener('click', onClick);
    return () => { 
      document.removeEventListener('click', onClick);
    }
  }, [])
  return <div>7</div>
}

const rootElement = document.getElementById("root");
ReactDOM.unmountComponentAtNode(rootElement);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  rootElement
);
    `;

export function EditorWrapper() {
  const [state, setState] = useImmer<State>({
    isLoaded: false,
    monaco: null!,
    types: {},
  });
  const wrapperRef = React.useRef<HTMLDivElement>(null!);

  React.useEffect(() => {
    if (state.isLoaded) {
      return;
    }
    async function init() {
      const monaco = await loader.init();
      const vsEditor = new CodeEditor(monaco, wrapperRef.current);
      await Promise.all([
        vsEditor.addLib(
          'react',
          'https://cdn.jsdelivr.net/npm/@types/react@17.0.2/index.d.ts'
        ),
        vsEditor.addLib(
          'react-dom',
          'https://cdn.jsdelivr.net/npm/@types/react-dom@17.0.2/index.d.ts'
        ),
      ]);
      vsEditor.addFile('./index.tsx', sampleCode);

      setState(draft => {
        draft.isLoaded = true;
        // draft.monaco = monaco;
        // Object.assign(draft.types, baseTypes);
      });
    }
    void init();
  }, []);

  return <div ref={wrapperRef} style={{ height: '100%' }}></div>;
}
