import { Registry } from 'monaco-textmate';
import { loadWASM } from 'onigasm';
import {
  Classification,
  HighlighterAction,
  HighlighterCallbackAction,
} from '../types';

declare const self: Worker;

function sendMessage(action: HighlighterCallbackAction) {
  self.postMessage(action);
}

const registry = new Registry({
  getGrammarDefinition: async _scopeName => {
    return {
      format: 'plist',
      content: await fetch('/grammars/TypeScriptReact.tmLanguage.plist').then(
        x => x.text()
      ),
    };
  },
});

let initPromise: Promise<void> | null = null;

async function init() {
  await loadWASM(await fetch('/onigasm.wasm').then(x => x.arrayBuffer()));
}

self.addEventListener('message', async event => {
  const action = event.data as HighlighterAction;
  const { lang, code, version } = action.payload;
  if (!initPromise) {
    initPromise = init();
  }
  await initPromise;
  const grammar = await registry.loadGrammar(lang);

  const lines = code.split('\n');
  let ruleStack: any = null;
  const classifications: Classification[] = [];
  for (let i = 0; i < lines.length; i++) {
    const result = grammar.tokenizeLine(lines[i], ruleStack);
    result.tokens.forEach(token => {
      const scope = token.scopes[token.scopes.length - 1];
      classifications.push({
        startLine: i + 1,
        endLine: i + 1,
        start: token.startIndex + 1,
        end: token.endIndex + 1,
        scope,
      });
    });
    ruleStack = result.ruleStack;
  }
  sendMessage({
    type: 'highlight',
    payload: {
      classifications,
      version,
    },
  });
});

export {};