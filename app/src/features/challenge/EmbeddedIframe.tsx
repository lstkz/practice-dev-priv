import React from 'react';
import { Bundler } from './Bundler';

export function EmbeddedIframe() {
  const iframeRef = React.useRef(null! as HTMLIFrameElement);
  const [bundler] = React.useState(() =>
    typeof window === 'undefined' ? null! : new Bundler()
  );

  function inject(code: string) {
    const importMap = {
      imports: {
        react:
          'https://unpkg.com/@esm-bundle/react@17.0.2/esm/react.development.js',
        'react-dom':
          'https://unpkg.com/@esm-bundle/react-dom@17.0.2/esm/react-dom.development.js',
      },
    };
    const head = iframeRef.current.contentDocument!.head;
    if (!head.querySelector('#__importmap')) {
      const importScript = document.createElement('script');
      importScript.setAttribute('type', 'importmap');
      importScript.setAttribute('id', '__importmap');
      importScript.innerHTML = JSON.stringify(importMap, null, 2);
      head.append(importScript);
    }
    const existing = head.querySelector('#__app');
    if (existing) {
      existing.remove();
    }
    const script = document.createElement('script');
    script.setAttribute('type', 'module');
    script.setAttribute('id', '__app');
    script.innerHTML = code;
    head.append(script);
  }

  React.useEffect(() => {
    void bundle();

    async function bundle() {
      const body = iframeRef.current.contentDocument!.body;
      if (!body.querySelector('#root')) {
        iframeRef.current.contentDocument!.body.innerHTML = `<div id="root"></div>`;
      }

      const moduleById: Record<string, { code: string }> = {
        './foo.js': {
          code: `export function foo(a, b) { return a + b; }`,
        },
        './test.js': {
          code: `export function test(a, b) { return a + b; }`,
        },
        './main.tsx': {
          code: `
          import React from "react";
          import ReactDOM from "react-dom";
          
          function App() {
            const [count, setCount] = React.useState(0);
            React.useEffect(() => {
              const onClick = () => {
                console.log('click2');
              };
              document.addEventListener('click', onClick);
              return () => {
                document.removeEventListener('click', onClick);
              };
            }, []);
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
              `,
        },
      };
      const code = await bundler.bundle({
        input: './main.tsx',
        modules: moduleById,
      });
      inject(code);
    }
  }, []);

  return <iframe ref={iframeRef}></iframe>;
}
