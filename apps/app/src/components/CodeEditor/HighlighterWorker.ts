import { Registry } from 'monaco-textmate';
import { loadWASM } from 'onigasm';

declare const self: Worker;

interface Classification {
  startLine: number;
  endLine: number;
  start: number;
  end: number;
  scope: string;
}

export interface HighlighResult {
  classifications: Classification[];
  version: number;
}

const registry = new Registry({
  getGrammarDefinition: async _scopeName => {
    // if (scopeName === 'source.css') {
    //   return {
    //     format: 'json',
    //     content: cssGrammar,
    //   }
    // }
    // if (scopeName === 'text.html.basic') {
    //   return {
    //     format: 'json',
    //     content: htmlGrammar,
    //   }
    // }
    return {
      format: 'plist',
      content: await fetch(
        '/grammars/TypeScriptReact.tmLanguage.plist'
      ).then(x => x.text()),
    };
  },
});

let initPromise: Promise<void> | null = null;

async function init() {
  await loadWASM(await fetch('/onigasm.wasm').then(x => x.arrayBuffer()));
}

self.addEventListener('message', async event => {
  const { lang, code, version } = event.data;
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
  self.postMessage({
    classifications,
    version,
  });
});

export {};
