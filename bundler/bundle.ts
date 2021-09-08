/* eslint-disable no-console */
import { rollup } from 'rollup';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import virtual from '@rollup/plugin-virtual';
import fs from 'fs';
import Path from 'path';

interface LibDefinition {
  name: string;
  inputFile?: string;
  external: string[];
  useDefault?: boolean;
}

const libs: LibDefinition[] = [
  // {
  //   name: 'react',
  //   external: [],
  //   useDefault: true,
  // },
  // {
  //   name: 'react-dom',
  //   external: ['react'],
  //   useDefault: true,
  // },
  {
    name: 'react-router-dom',
    external: ['react', 'react-dom', 'react-router', 'history', 'prop-types'],
    // useDefault: true,
  },
  // {
  //   name: 'react-router',
  //   external: ['react'],
  // },
];

function snake2Pascal(input: string) {
  const arr = input.split('-');
  for (let i = 0; i < arr.length; i++) {
    arr[i] = arr[i].slice(0, 1).toUpperCase() + arr[i].slice(1, arr[i].length);
  }
  return arr.join('');
}

async function _bundleLib(lib: LibDefinition) {
  const libExports = require(lib.name);
  // console.log(libExports);
  const pascalName = snake2Pascal(lib.name);
  const newIndex = `import ${
    lib.useDefault ? '' : '* as '
  }${pascalName} from '${lib.name}';

//export default ${pascalName};
export const __esmModule = true;
export const {
${Object.keys(libExports)
  .map(x => `  ${x},`)
  .join('\n')}
} = ${pascalName};
`;
  fs.writeFileSync(Path.join(__dirname, lib.name + '.js'), newIndex);

  const pkg = require(lib.name + '/package.json');
  const isModule = Boolean(pkg.module);
  // console.log(pkg);
  const imports = new Set<string>();
  const input = isModule
    ? require.resolve(lib.name + '/' + pkg.module)
    : require.resolve(lib.name);
  // console.log({ input });
  const build = await rollup({
    // input: lib.useDefault
    //   ? require.resolve('./' + lib.name)
    //   :
    input: input, //require.resolve('./' + lib.name),
    plugins: [
      replace({
        preventAssignment: true,
        values: {
          'process.env.NODE_ENV': JSON.stringify('development'),
        },
      }),
      {
        name: 'test',
        resolveId(target, parent) {
          // ignore IDs with null character, these belong to other plugins
          if (/\0/.test(target)) return null;
          if (lib.external.includes(target)) {
            return false;
          }
          const split = target.split('/');
          const start = split[0][0] === '@' ? 2 : 1;
          const targetLib = split.slice(0, start).join('/');
          const targetPath = split.slice(start).join('/');
          // console.log(
          //   { target, targetLib, targetPath },
          //   require.resolve(target)
          // );
          if (targetPath) {
            return require.resolve(targetLib + '/' + targetPath);
          } else {
            const libPkg = require(targetLib);
            if (!libPkg.module) {
              throw new Error(`Dependency ${targetLib} is not a module.`);
            }
            return require.resolve(targetLib + '/' + libPkg.module);
          }
          // if (/^[@a-zA-Z0-9]/.test(target)) {
          //   if (!imports.has(target)) {
          //     // console.log(target);
          //   }
          //   imports.add(target);
          //   return false;
          // }
          // console.log({ target, parent });
          // if (target === lib.name) {
          //   // console.log(require.resolve(target));
          //   return require.resolve(target);
          // }
          // if (target[0] !== '/') {
          //   return false;
          // }
          // console.log({ target, parent });
          // if (!target.includes('/node_modules/')) {
          //   return target;
          // }
          // const targetLib = target.split('/node_modules/')[1].split('/')[0];
          // if (targetLib === lib.name) {
          //   return target;
          // }
          // console.log(target);
          // return null;
          // console.log({ target, parent });
          // return target;
        },
      },
      ...(pkg.module ? [] : [resolve(), commonjs()]),
      // {
      //   name: 'test',
      //   resolveId(target) {
      //     if (!target.includes('/node_modules')) {
      //       return target;
      //     }
      //     const targetLib = target.split('/node_modules/')[1].split('/')[0];
      //     if (targetLib === lib.name) {
      //       return target;
      //     }
      //     console.log(target);
      //     return false;
      //     // console.log({ target, parent });
      //     // return target;
      //   },
      // },
    ],
    // external: lib.external,
    // external: Object.keys(pkg.dependencies),
  });
  return;
  const { output } = await build.generate({
    sourcemap: false,
    inlineDynamicImports: true,
    format: 'esm',
    exports: 'named',
  });
  const sourceFilename = `${lib.name}@${pkg.version}.js`;
  fs.writeFileSync(
    Path.join(__dirname, 'libs', `${lib.name}@${pkg.version}.js`),
    output[0].code
  );

  const types = fs.readFileSync(
    require.resolve('@types/' + lib.name + '/index.d.ts')
  );
  const typesPkg = require('@types/' + lib.name + '/package.json');
  const typesFilename = `@types/${lib.name}@${typesPkg.version}.js`;
  fs.writeFileSync(Path.join(__dirname, 'libs/', typesFilename), types);

  const libOutput = {
    name: lib.name,
    source: 'https://cdn.practice.dev/npm/' + sourceFilename,
    types: 'https://cdn.practice.dev/npm/' + typesFilename,
  };
  return libOutput;
}

async function bundle() {
  const ret = await Promise.all(libs.map(_bundleLib));
  console.log(ret);
}

// void bundle();

async function findAllDeps(lib: string, deps: Set<string>) {
  if (deps.has(lib)) {
    return;
  }
  deps.add(lib);
  const pkg = require(lib + '/package.json');
  const isModule = Boolean(pkg.module);
  const input = isModule
    ? require.resolve(lib + '/' + pkg.module)
    : require.resolve(lib);
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
            deps.add(target);
            return false;
          }
          return null;
        },
      },
      ...(pkg.module ? [] : [resolve(), commonjs()]),
    ],
  });
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
  if (targetPath && !isModule) {
    throw new Error('Custom path for non-module not supported');
  }
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
  const dir = Path.join(lib, targetPath);
  const sourceFilename = `${pkg.version}.js`;
  const fullDir = Path.join(__dirname, 'libs', dir);
  fs.mkdirSync(fullDir, { recursive: true });
  fs.writeFileSync(Path.join(fullDir, sourceFilename), output[0].code);
  const libOutput = {
    name: lib,
    source: 'https://cdn.practice.dev/npm/' + Path.join(dir, sourceFilename),
    types: '',
  };
  return libOutput;
}

const deps: Set<string> = new Set();
void findAllDeps('react-router-dom', deps).then(async () => {
  console.log(deps);

  await Promise.all(
    [...deps.values()].map(async lib => {
      try {
        console.log(await bundleLib(lib));
      } catch (e) {
        console.error('bundle failed for ', lib, e);
      }
    })
  );
});
