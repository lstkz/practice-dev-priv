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

const DOMAIN = process.env.STAGE
  ? 'https://cdn.styx-dev.com'
  : 'https://cdn.practice.dev';

interface LibOutput {
  name: string;
  source: string;
  types: string;
}

function _getHash(content: string) {
  return md5(content).substr(0, 10);
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
  const content = output[0].code;
  const sourceFilename = `${pkg.version}.${_getHash(content)}.js`;
  const fullDir = Path.join(__dirname, 'libs', dir);
  fs.mkdirSync(fullDir, { recursive: true });
  fs.writeFileSync(Path.join(fullDir, sourceFilename), content);
  const libOutput: LibOutput = {
    name: lib,
    source: DOMAIN + '/npm/' + Path.join(dir, sourceFilename),
    types: '',
  };
  return libOutput;
}

function ensureSuffix(str: string, suffix: string) {
  return str.endsWith(suffix) ? str : str + suffix;
}

async function fetchTypes(output: LibOutput) {
  const lib = output.name;
  if (!/^(@[a-z0-9_-]+\/[a-z0-9_-]+)|([a-z0-9_-]+)$/.test(lib)) {
    // TODO
    return;
  }
  const mapOrgLib = (lib: string) => {
    if (lib[0] === '@') {
      return lib.substr(1).replace('/', '__');
    }
    return lib;
  };
  const getTypes = (lib: string) => {
    let pkg: any = null;
    try {
      pkg = require(lib + '/package.json');
    } catch (e) {
      return null;
    }
    const forceTypingsPath = Path.join(
      __dirname,
      'force-typings',
      lib,
      'default.d.ts'
    );
    if (fs.existsSync(forceTypingsPath)) {
      return { content: fs.readFileSync(forceTypingsPath, 'utf8'), pkg };
    }
    if (!pkg.types && !pkg.typings) {
      return null;
    }
    const types = (pkg.types || pkg.typings).replace('./', '');
    const content = fs.readFileSync(
      require.resolve(lib + '/' + ensureSuffix(types, '.d.ts')),
      'utf8'
    );
    return { content, pkg };
  };
  const targetLib = '@types/' + mapOrgLib(lib);
  const data = getTypes(targetLib) || getTypes(lib);
  if (!data) {
    return;
  }
  const { content, pkg } = data;
  const sourceFilename = `${pkg.version}.${_getHash(content)}.d.ts`;
  const fullDir = Path.join(__dirname, 'libs', targetLib);
  fs.mkdirSync(fullDir, { recursive: true });
  fs.writeFileSync(Path.join(fullDir, sourceFilename), content);
  output.types = DOMAIN + '/npm/' + Path.join(targetLib, sourceFilename);
}

// async function fetchTypes2(output: LibOutput) {
//   const lib = output.name;
//   if (!/^(@[a-z0-9_-]+\/[a-z0-9_-]+)|([a-z0-9_-]+)$/.test(lib)) {
//     // TODO
//     return;
//   }
//   const mapOrgLib = (lib: string) => {
//     if (lib[0] === '@') {
//       return lib.substr(1).replace('/', '__');
//     }
//     return lib;
//   };
//   const getTypes = (lib: string) => {
//     let pkg: any = null;
//     try {
//       pkg = require(lib + '/package.json');
//     } catch (e) {
//       return null;
//     }
//     if (!pkg.types && !pkg.typings) {
//       return null;
//     }
//     const types = (pkg.types || pkg.typings).replace('./', '');
//     // const content = fs.readFileSync(
//     //   require.resolve(lib + '/' + ensureSuffix(types, '.d.ts')),
//     //   'utf8'
//     // );
//     return {
//       path: require.resolve(lib + '/' + ensureSuffix(types, '.d.ts')),
//       pkg,
//     };
//   };
//   const targetLib = '@types/' + mapOrgLib(lib);
//   const data = getTypes(targetLib) || getTypes(lib);
//   if (!data) {
//     return;
//   }
//   const { path, pkg } = data;

//   const build = await rollup({
//     input: path,
//     plugins: [ts()],
//   });
//   const ret = await build.generate({
//     format: 'es',
//     // plugins: [flatDts()],
//   });
//   if (lib === '@reduxjs/toolkit') {
//     console.log(ret);
//   }
//   const content = ret.output[0].code;
//   const hash = md5(content);
//   const sourceFilename = `${pkg.version}.d.ts`;
//   const fullDir = Path.join(__dirname, 'libs', targetLib);
//   fs.mkdirSync(fullDir, { recursive: true });
//   fs.writeFileSync(Path.join(fullDir, sourceFilename), content);
//   output.types = DOMAIN + '/npm/' + Path.join(targetLib, sourceFilename);
// }

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
  if (!pkg.types && !pkg.typings) {
    return null;
  }
  const types = ensureSuffix(
    (pkg.types || pkg.typings).replace('./', ''),
    '.d.ts'
  );
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
  if (!pkg.types && !pkg.typings) {
    return null;
  }
  const tmpFile = tmp.fileSync();
  const projectFolder = Path.join(__dirname, 'node_modules', lib);
  const types = ensureSuffix(
    (pkg.types || pkg.typings).replace('./', ''),
    '.d.ts'
  );
  const config = ExtractorConfig.prepare({
    configObject: {
      projectFolder,
      mainEntryPointFilePath: require.resolve(lib + '/' + types),
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

async function fetchTypes3(output: LibOutput) {
  const lib = output.name;
  if (!/^(@[a-z0-9_-]+\/[a-z0-9_-]+)|([a-z0-9_-]+)$/.test(lib)) {
    // TODO
    return;
  }
  // const mapOrgLib = (lib: string) => {
  //   if (lib[0] === '@') {
  //     return lib.substr(1).replace('/', '__');
  //   }
  //   return lib;
  // };

  // const getTypes = (lib: string) => {
  //   let pkg: any = null;
  //   try {
  //     pkg = require(lib + '/package.json');
  //   } catch (e) {
  //     return null;
  //   }
  //   if (!pkg.types && !pkg.typings) {
  //     return null;
  //   }
  //   const types = (pkg.types || pkg.typings).replace('./', '');
  //   // const content = fs.readFileSync(
  //   //   require.resolve(lib + '/' + ensureSuffix(types, '.d.ts')),
  //   //   'utf8'
  //   // );
  //   return {
  //     path: require.resolve(lib + '/' + ensureSuffix(types, '.d.ts')),
  //     pkg,
  //     projectFolder: Path.join(__dirname, 'node_modules', lib),
  //   };
  // };
  // const targetLib = '@types/' + mapOrgLib(lib);
  // const data = getTypes(targetLib) || getTypes(lib);
  // if (!data) {
  //   return;
  // }
  // const { path, pkg, projectFolder } = data;

  // const tmpFile = tmp.fileSync();
  // const config = ExtractorConfig.prepare({
  //   configObject: {
  //     projectFolder,
  //     mainEntryPointFilePath: path,
  //     dtsRollup: {
  //       enabled: true,
  //       untrimmedFilePath: tmpFile.name,
  //     },
  //     compiler: {
  //       tsconfigFilePath: Path.join(__dirname, 'tsconfig.json'),
  //     },
  //   },
  //   configObjectFullPath: undefined,
  //   packageJsonFullPath: Path.join(projectFolder, 'package.json'),
  // });
  // Extractor.invoke(config);
  // const content = fs.readFileSync(tmpFile.name, 'utf8');
  // tmpFile.removeCallback();

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

async function generate() {
  const deps: Set<string> = new Set();
  const baseLibs = ['@reduxjs/toolkit', 'react', 'react-dom', 'react-redux'];
  await Promise.all(baseLibs.map(lib => findAllDeps(lib, deps)));
  const result: LibOutput[] = [];
  await Promise.all(
    [...deps.values()].map(async lib => {
      try {
        const output = await bundleLib(lib);
        await fetchTypes3(output);
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
