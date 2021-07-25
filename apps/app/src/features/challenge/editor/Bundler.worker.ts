import * as Babel from '@babel/standalone';
import { rollup } from 'rollup';
import { BundlerAction, BundlerCallbackAction, SourceCode } from 'src/types';

declare const self: Worker;

function sendMessage(action: BundlerCallbackAction) {
  self.postMessage(action);
}

interface BuildSourceCodeOptions {
  input: string;
  modules: Record<string, SourceCode>;
}

async function buildSourceCode(options: BuildSourceCodeOptions) {
  const { input, modules } = options;
  const extensions = ['.ts', '.tsx', '.js', '.jsx'];
  return rollup({
    input,

    plugins: [
      {
        name: 'test',
        resolveId(target, _parent) {
          if (target[0] !== '.') {
            return false;
          }
          for (const ext of extensions) {
            if (modules[target + ext]) {
              target += ext;
              break;
            }
          }
          // TODO: handler relative

          return target;
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
  } catch (e) {
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
