import * as Babel from '@babel/standalone';
import { rollup } from 'rollup';

declare const self: Worker;

export interface SourceCode {
  code: string;
}

export interface BundlerRequest {
  input: string;
  modules: Record<string, SourceCode>;
  version: number;
}

export interface BundlerResponse {
  code: string;
  version: number;
}

self.addEventListener('message', async event => {
  const { input, version, modules } = event.data as BundlerRequest;
  const extensions = ['.ts', '.tsx', '.js', '.jsx'];

  const build = await rollup({
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

  self.postMessage({
    code,
    version,
  } as BundlerResponse);
});

export {};
