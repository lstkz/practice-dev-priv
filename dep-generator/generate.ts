/* eslint-disable no-console */
import { rollup } from 'rollup';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import virtual from '@rollup/plugin-virtual';
import fs from 'fs';
import Path from 'path';

interface LibOutput {
  name: string;
  source: string;
  types: string;
}

function snake2Pascal(input: string) {
  const arr = input.split('-');
  for (let i = 0; i < arr.length; i++) {
    arr[i] = arr[i].slice(0, 1).toUpperCase() + arr[i].slice(1, arr[i].length);
  }
  return arr.join('');
}

async function findAllDeps(lib: string, deps: Set<string>) {
  if (deps.has(lib)) {
    return;
  }
  deps.add(lib);
  const pkg = require(extractLibName(lib) + '/package.json');
  const isModule = Boolean(pkg.module);
  const input = isModule
    ? require.resolve(lib + '/' + pkg.module)
    : require.resolve(lib);
  const newDeps: string[] = [];
  await rollup({
    input: input,
    plugins: [
      {
        name: 'test',
        resolveId(target) {
          if (/\0/.test(target)) {
            return null;
          }
          if (/^[@a-zA-Z0-9]/.test(target)) {
            if (!deps.has(target)) {
              newDeps.push(target);
            }
            return false;
          }
          return null;
        },
      },
      ...(pkg.module ? [] : [resolve(), commonjs()]),
    ],
  });
  await Promise.all(newDeps.map(dep => findAllDeps(dep, deps)));
}

function extractLibName(path: string) {
  const parts = path.includes('/node_modules/')
    ? path.split('/node_modules/')[1].split('/')
    : path.split('/');
  if (parts[0][0] === '@') {
    return parts.slice(0, 2).join('/');
  }
  return parts[0];
}

async function bundleLib(lib: string) {
  const split = lib.split('/');
  const start = split[0][0] === '@' ? 2 : 1;
  const targetLib = split.slice(0, start).join('/');
  const targetPath = split.slice(start).join('/');
  const pkg = require(targetLib + '/package.json');
  const isModule =
    Boolean(pkg.module) || ['@babel/runtime'].includes(targetLib);
  const input = targetPath
    ? require.resolve(targetLib + '/' + targetPath)
    : isModule
    ? require.resolve(lib + '/' + pkg.module)
    : 'index.js';
  const pascalName = snake2Pascal(lib) + '$$$';
  const build = await rollup({
    input: input,
    plugins: [
      ...(isModule
        ? []
        : [
            virtual({
              'index.js': `import ${pascalName} from '${lib}';

export default ${pascalName};
export const __esmModule = true;
export const {
${Object.keys(require(lib))
  .map(x => `  ${x},`)
  .join('\n')}
} = ${pascalName};
`,
            }) as any,
          ]),
      replace({
        preventAssignment: true,
        values: {
          'process.env.NODE_ENV': JSON.stringify('development'),
        },
      }),
      {
        name: 'test',
        resolveId(target) {
          if (/^[@a-zA-Z0-9]/.test(target) && extractLibName(target) !== lib) {
            return false;
          }
          return null;
        },
      },
      ...(pkg.module ? [] : [resolve(), commonjs()]),
    ],
  });
  const { output } = await build.generate({
    sourcemap: false,
    inlineDynamicImports: true,
    format: 'esm',
    exports: 'named',
  });
  const dir = Path.join(targetLib, targetPath);
  const sourceFilename = `${pkg.version}.js`;
  const fullDir = Path.join(__dirname, 'libs', dir);
  fs.mkdirSync(fullDir, { recursive: true });
  fs.writeFileSync(Path.join(fullDir, sourceFilename), output[0].code);
  const libOutput: LibOutput = {
    name: lib,
    source: 'https://cdn.practice.dev/npm/' + Path.join(dir, sourceFilename),
    types: '',
  };
  return libOutput;
}

function ensureSuffix(str: string, suffix: string) {
  return str.endsWith(suffix) ? str : str + suffix;
}

async function fetchTypes(output: LibOutput) {
  const lib = output.name;
  if (lib.includes('/')) {
    // TODO
    return;
  }
  const targetLib = '@types/' + lib;
  let pkg: any = null;
  try {
    pkg = require(targetLib + '/package.json');
  } catch (e) {
    return;
  }
  if (!pkg.types) {
    return;
  }
  const content = fs.readFileSync(
    require.resolve(targetLib + '/' + ensureSuffix(pkg.types, '.d.ts')),
    'utf8'
  );
  const sourceFilename = `${pkg.version}.d.ts`;
  const fullDir = Path.join(__dirname, 'libs', targetLib);
  fs.mkdirSync(fullDir, { recursive: true });
  fs.writeFileSync(Path.join(fullDir, sourceFilename), content);
  output.types =
    'https://cdn.practice.dev/npm/' + Path.join(targetLib, sourceFilename);
}

async function generate() {
  const deps: Set<string> = new Set();
  const baseLibs = ['react', 'react-dom', 'react-router-dom'];
  await Promise.all(baseLibs.map(lib => findAllDeps(lib, deps)));
  const result: LibOutput[] = [];
  await Promise.all(
    [...deps.values()].map(async lib => {
      try {
        const output = await bundleLib(lib);
        await fetchTypes(output);
        result.push(output);
      } catch (e) {
        console.error('bundle failed for ', lib, e);
        process.exit(1);
      }
    })
  );
  console.log(JSON.stringify(result, null, 2));
}

void generate();
