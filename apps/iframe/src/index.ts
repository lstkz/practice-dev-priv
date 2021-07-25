import { PARENT_ORIGIN } from './config';
import {
  IframeCallbackMessage,
  IframeMessage,
  IframeNavigationCallbackMessage,
} from 'shared';
import { createNavigationProxy } from './NavigationProxy';

function sendMessage(
  message: IframeCallbackMessage | IframeNavigationCallbackMessage
) {
  if (parent) {
    parent.postMessage(message, PARENT_ORIGIN);
  }
}

function showError(content: string) {
  document.getElementById('__bundler-error')?.remove();
  const container = document.createElement('div');
  container.setAttribute('id', '__bundler-error');
  container.textContent = content;
  container.style.whiteSpace = 'pre';
  container.style.fontFamily =
    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';
  container.style.fontSize = '12px';
  container.style.background = '#FEF2F2';
  container.style.color = '#DC2626';
  container.style.position = 'fixed';
  container.style.left = '0';
  container.style.right = '0';
  container.style.top = '0';
  container.style.bottom = '0';
  container.style.padding = '15px';
  container.style.overflow = 'auto';

  document.body.append(container);
}

window.addEventListener('error', function (event) {
  showError(event.error.stack);
});

window.addEventListener('message', e => {
  if (e.origin !== PARENT_ORIGIN) {
    return;
  }
  const action = e.data as IframeMessage;
  switch (action.type) {
    case 'error': {
      const { error } = action.payload;
      showError(error.message);
      break;
    }
    case 'inject': {
      document.getElementById('__bundler-error')?.remove();
      const { code, importMap } = action.payload;
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

sendMessage({
  target: 'preview',
  type: 'hard-reload',
});

createNavigationProxy();

export {};
