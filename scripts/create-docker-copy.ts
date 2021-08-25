/* eslint-disable no-console */

import fs from 'fs';
import Path from 'path';

const roots: string[] = [];

['apps', 'packages', 'packages-pvd'].forEach(name => {
  fs.readdirSync(Path.join(__dirname, '../', name)).forEach(sub => {
    roots.push(name + '/' + sub);
  });
});

console.log(
  roots.map(name => `COPY ${name}/package.json ${name}/package.json`).join('\n')
);
