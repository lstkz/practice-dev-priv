import * as R from 'remeda';
import fs from 'fs';
import Path from 'path';
import {
  BaseBinding,
  CreateEventBindingOptions,
  CreateGraphqlBindingOptions,
  CreateTaskBindingOptions,
} from '../lib';

function walk(dir: string) {
  const results: string[] = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = Path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results.push(...walk(file));
    } else {
      results.push(file);
    }
  });
  return results;
}

const bindings: any[] = R.flatMap(
  walk(Path.join(__dirname, '../contracts')),
  file => require(file)
);

export function getBindings(type: 'event'): CreateEventBindingOptions<any>[];
export function getBindings(type: 'task'): CreateTaskBindingOptions<any>[];
export function getBindings(type: 'graphql'): CreateGraphqlBindingOptions[];
export function getBindings(
  type: 'event' | 'task' | 'graphql'
):
  | CreateEventBindingOptions<any>[]
  | CreateTaskBindingOptions<any>[]
  | CreateGraphqlBindingOptions[] {
  return R.pipe(
    bindings,
    R.flatMap(obj => Object.values(obj) as BaseBinding<string, any>[]),
    R.filter(x => x.isBinding && x.type === type),
    R.map(x => x.options)
  );
}
