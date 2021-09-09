/* eslint-disable no-console */
import tmp from 'tmp';
import { rollup } from 'rollup';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import virtual from '@rollup/plugin-virtual';
import { Extractor, ExtractorConfig } from '@microsoft/api-extractor';
import fs from 'fs';
import Path from 'path';
import md5 from 'md5';
import { walk } from './helper';

const REMOVE_SCOPE_CHAR = ['@reduxjs/toolkit'];

const monkeyPatches = [
  {
    path: Path.join(
      __dirname,
      'node_modules',
      '@reduxjs/toolkit/dist/query/react/index.d.ts'
    ),
    transform: (str: string) => {
      return str.replace(
        `export * from '@reduxjs/toolkit/query';`,
        `export * from '../';`
      );
    },
  },
];

const DOMAIN = process.env.STAGE
  ? 'https://cdn.styx-dev.com'
  : 'https://cdn.practice.dev';

interface LibOutput {
  name: string;
  source: string;
  types: string;
  typesBundle: string;
}

function _getHash(content: string) {
  return md5(content).substr(0, 10);
}

function _snake2Pascal(input: string) {
  const arr = input.split('-');
  for (let i = 0; i < arr.length; i++) {
    arr[i] = arr[i].slice(0, 1).toUpperCase() + arr[i].slice(1, arr[i].length);
  }
  return arr.join('');
}

function _findPackage(lib: string) {
  let path = Path.join(__dirname, 'node_modules', lib, 'package.json');
  if (!fs.existsSync(path)) {
    path = Path.join(
      __dirname,
      'node_modules',
      extractLibName(lib),
      'package.json'
    );
  }
  if (!fs.existsSync(path)) {
    throw new Error('Cannot find package.json for ' + lib);
  }
  return {
    pkgPath: path,
    pkg: JSON.parse(fs.readFileSync(path, 'utf8')),
  };
}

async function findAllDeps(lib: string, deps: Set<string>) {
  if (deps.has(lib)) {
    return;
  }
  deps.add(lib);
  const { pkg } = _findPackage(lib);
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
  const pascalName = _snake2Pascal(lib) + '$$$';
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
  const content = output[0].code;
  const sourceFilename = `${pkg.version}.${_getHash(content)}.js`;
  const fullDir = Path.join(__dirname, 'libs', dir);
  fs.mkdirSync(fullDir, { recursive: true });
  fs.writeFileSync(Path.join(fullDir, sourceFilename), content);
  const libOutput: LibOutput = {
    name: lib,
    source: DOMAIN + '/npm/' + Path.join(dir, sourceFilename),
    types: '',
    typesBundle: '',
  };
  return libOutput;
}

function ensureSuffix(str: string, suffix: string) {
  if (!str) {
    return null;
  }
  return str.endsWith(suffix) ? str : str + suffix;
}

function mapOrgLib(lib: string) {
  if (lib[0] === '@') {
    return lib.substr(1).replace('/', '__');
  }
  return lib;
}

function getExternalTypeData(lib: string) {
  const targetLib = '@types/' + mapOrgLib(lib);
  let pkg: any = null;
  try {
    pkg = require(targetLib + '/package.json');
  } catch (e) {
    return null;
  }
  const types = ensureSuffix(
    (pkg.types || pkg.typings).replace('./', ''),
    '.d.ts'
  );
  if (!types) {
    return null;
  }
  const content = fs.readFileSync(
    require.resolve(targetLib + '/' + ensureSuffix(types, '.d.ts')),
    'utf8'
  );
  return { pkg, content };
}

function getEmbeddedTypeData(lib: string) {
  let pkg: any = null;
  try {
    pkg = require(lib + '/package.json');
  } catch (e) {
    return null;
  }
  const types = ensureSuffix(pkg.types || pkg.typings, '.d.ts');
  if (!types) {
    return null;
  }
  const entry = Path.join(__dirname, 'node_modules', lib, types);
  const patch = monkeyPatches.find(x => x.path === entry);
  if (patch) {
    const src = fs.readFileSync(entry, 'utf8');
    const transformed = patch.transform(src);
    fs.writeFileSync(entry, transformed);
  }
  const tmpFile = tmp.fileSync();
  const projectFolder = Path.join(__dirname, 'node_modules', lib);
  const config = ExtractorConfig.prepare({
    configObject: {
      projectFolder,
      mainEntryPointFilePath: entry,
      dtsRollup: {
        enabled: true,
        untrimmedFilePath: tmpFile.name,
      },
      compiler: {
        tsconfigFilePath: Path.join(__dirname, 'tsconfig.json'),
      },
    },
    configObjectFullPath: undefined,
    packageJsonFullPath: Path.join(projectFolder, 'package.json'),
  });
  Extractor.invoke(config);
  const content = fs.readFileSync(tmpFile.name, 'utf8');
  tmpFile.removeCallback();
  return { pkg, content };
}

async function fetchTypes(output: LibOutput) {
  const lib = output.name;
  if (!/^(@[a-z0-9_-]+\/[a-z0-9_-]+)|([a-z0-9_-]+)$/.test(lib)) {
    // TODO
    return;
  }
  const data = getExternalTypeData(lib) || getEmbeddedTypeData(lib);
  if (!data) {
    return;
  }
  const targetLib = '@types/' + mapOrgLib(lib);
  const { content, pkg } = data;

  const sourceFilename = `${pkg.version}.${_getHash(content)}.d.ts`;
  const fullDir = Path.join(__dirname, 'libs', targetLib);
  fs.mkdirSync(fullDir, { recursive: true });
  fs.writeFileSync(Path.join(fullDir, sourceFilename), content);
  output.types = DOMAIN + '/npm/' + Path.join(targetLib, sourceFilename);
}

async function fetchTypesBundle(output: LibOutput) {
  const lib = output.name;
  if (!/^(@[a-z0-9_-]+\/[a-z0-9_-]+)|([a-z0-9_-]+)$/.test(lib)) {
    // TODO
    return;
  }
  const { pkg, pkgPath } = _findPackage(lib);
  const types = ensureSuffix(pkg.types || pkg.typings, '.d.ts');
  if (!types) {
    return;
  }
  const typesEntry = Path.join(Path.dirname(pkgPath), types);
  const typeBaseDir = Path.dirname(typesEntry);
  const bundle: Record<string, string> = {};
  const files = walk(typeBaseDir).filter(x => x.endsWith('.d.ts'));
  files.forEach(file => {
    const relative = Path.relative(typeBaseDir, file);
    let content = fs.readFileSync(file, 'utf8');
    REMOVE_SCOPE_CHAR.forEach(scope => {
      content = content.replace(new RegExp(scope, 'g'), scope.substr(1));
    });
    bundle[relative] = content;
  });
  const content = JSON.stringify(bundle, null, 2);

  // const data = getExternalTypeData(lib) || getEmbeddedTypeData(lib);
  // if (!data) {
  //   return;
  // }
  // const targetLib = '@types/' + mapOrgLib(lib);
  // const { content, pkg } = data;

  const targetLib = '@types/' + mapOrgLib(lib);
  const sourceFilename = `${pkg.version}.${_getHash(content)}.json`;
  const fullDir = Path.join(__dirname, 'libs', targetLib);
  fs.mkdirSync(fullDir, { recursive: true });
  fs.writeFileSync(Path.join(fullDir, sourceFilename), content);
  output.typesBundle = DOMAIN + '/npm/' + Path.join(targetLib, sourceFilename);
}

async function generate() {
  const deps: Set<string> = new Set();
  const baseLibs = [
    '@reduxjs/toolkit',
    '@reduxjs/toolkit/query',
    '@reduxjs/toolkit/query/react',
    'react',
    'react-dom',
    'react-redux',
  ];
  await Promise.all(baseLibs.map(lib => findAllDeps(lib, deps)));
  const result: LibOutput[] = [];
  await Promise.all(
    [...deps.values()].map(async lib => {
      try {
        const output = await bundleLib(lib);
        await fetchTypesBundle(output);
        result.push(output);
      } catch (e) {
        console.error('bundle failed for ', lib, e);
        process.exit(1);
      }
    })
  );
  result.forEach(item => {
    if (REMOVE_SCOPE_CHAR.some(x => item.name.startsWith(x))) {
      item.name = item.name.substr(1);
    }
  });
  console.log(JSON.stringify(result, null, 2));
}

void generate();
