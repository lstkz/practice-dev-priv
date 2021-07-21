console.log('iframe2');

window.addEventListener('message', e => {
  if (e.origin !== 'http://localhost:4001') {
    return;
  }
  const { type, payload } = e.data;
  switch (type) {
    case 'inject': {
      const { code, importMap } = payload;
      if (!document.body.querySelector('#root')) {
        const root = document.createElement('div');
        root.setAttribute('id', 'root');
        document.body.append(root);
      }
      const head = document.head;
      if (!head.querySelector('#__importmap')) {
        const importScript = document.createElement('script');
        importScript.setAttribute('type', 'importmap');
        importScript.setAttribute('id', '__importmap');
        importScript.innerHTML = JSON.stringify(
          {
            imports: importMap,
          },
          null,
          2
        );
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
      break;
    }
  }
});

console.log(
  parent.postMessage(
    {
      type: 'hard-reload',
    },
    '*'
  )
);

export {};
