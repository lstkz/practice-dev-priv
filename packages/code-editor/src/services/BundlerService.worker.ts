import * as Babel from '@babel/standalone';
import { rollup } from 'rollup';
import { BundlerAction, BundlerCallbackAction, SourceCode } from '../types';

declare const self: Worker;

function sendMessage(action: BundlerCallbackAction) {
  self.postMessage(action);
}

interface BuildSourceCodeOptions {
  input: string;
  modules: Record<string, SourceCode>;
}

function _getRelativePath(target: string, parent: string) {
  const target_split = target.split('/');
  const parent_split = parent.split('/');
  parent_split.pop();
  while (target_split[0] === '..') {
    target_split.shift();
    parent_split.pop();
  }
  if (parent_split[0]) {
    parent_split.shift();
  }
  const base = [...parent_split, ...target_split].filter(x => x !== '.');
  return ['.', ...base].join('/');
}

async function buildSourceCode(options: BuildSourceCodeOptions) {
  const { input, modules } = options;

  const extensions = ['.ts', '.tsx', '.js', '.jsx'];
  return rollup({
    input,

    plugins: [
      {
        name: 'test',
        resolveId(target, parent) {
          if (target[0] !== '.') {
            return false;
          }
          let path = _getRelativePath(target, parent ?? '');
          for (const ext of extensions) {
            if (modules[path + ext]) {
              path += ext;
              break;
            }
          }
          return path;
        },
        load: function (id) {
          if (!modules[id]) {
            throw new Error('Module not found: ' + id);
          }
          return modules[id].code;
        },
        transform(code, filename) {
          const presets: any = [];
          if (/\.(t|j)sx/.test(filename)) {
            presets.push(Babel.availablePresets.react);
          }
          if (/\.tsx?/.test(filename)) {
            presets.push(Babel.availablePresets.typescript);
          }
          return Babel.transform(code, {
            filename,
            presets,
          }) as any;
        },
      },
    ],
  });
}

self.addEventListener('message', async event => {
  const action = event.data as BundlerAction;
  const { input, version, modules } = action.payload;

  try {
    const build = await buildSourceCode({ input, modules });
    const { output } = await build.generate({
      sourcemap: 'inline',
      inlineDynamicImports: true,
      format: 'es',
    });
    if (output.length !== 1) {
      throw new Error('Expected single output, got: ' + output.length);
    }
    const code =
      output[0].code + '\n//# sourceMappingURL=' + output[0].map!.toUrl();
    sendMessage({
      type: 'bundled',
      payload: {
        code,
        version,
      },
    });
  } catch (e: any) {
    console.error('bundler error', e);
    sendMessage({
      type: 'error',
      payload: {
        error: e,
        version,
      },
    });
  }
});

export {};
