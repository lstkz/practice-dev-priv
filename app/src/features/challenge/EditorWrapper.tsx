import { useImmer } from 'context-api';
import React from 'react';
import { CodeEditor } from '../../components/CodeEditor/CodeEditor';
import { Monaco } from '../../types';
import loader from '@monaco-editor/loader';
import { styled } from 'twin.macro';

type State = {
  isLoaded: boolean;
  monaco: Monaco;
  types: Record<string, string>;
};

const sampleCode = `
import React from "react";
import ReactDOM from "react-dom";

function App() {
  const [count, setCount] = React.useState(0);
  return (
    <div>
      <h2>
        Count: <span data-test="count">{count}</span>
      </h2>
      <button
        data-test="increase-btn"
        onClick={() => {
          setCount(count + 1);
        }}
      >
        increase
      </button>
    </div>
  );
}

const rootElement = document.getElementById("root")!;
ReactDOM.unmountComponentAtNode(rootElement);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  rootElement
);
    `.trimStart();

const Wrapper = styled.div`
  .view-line {
    .mtk1,
    .mtk2,
    .mtk3,
    .mtk4,
    .mtk5,
    .mtk6,
    .mtk7,
    .mtk8,
    .mtk9,
    .mtk10,
    .mtk11,
    .mtk12,
    .mtk13,
    .mtk14,
    .mtk15,
    .mtk16,
    .mtk17,
    .mtk18,
    .mtk19,
    .mtk20,
    .mtk21,
    .mtk22,
    .mtk23,
    .mtk24,
    .mtk25 {
      color: #dcdcdc;
    }
  }
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

  return (
    <Wrapper
      ref={wrapperRef}
      style={{ height: '100%', background: '#011627' }}
      tw="border-l border-gray-800"
    ></Wrapper>
  );
}
