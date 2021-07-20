import * as R from 'remeda';
import { ElementInfo } from './FileService';

export class FileTreeHelper {
  private elementMap: Record<string, ElementInfo>;
  constructor(private elements: ElementInfo[]) {
    this.elementMap = R.indexBy(elements, x => x.id);
  }

  getPath(id: string) {
    let file = this.elementMap[id];
    const path = [file.name];
    while (file.parentId) {
      file = this.elementMap[file.parentId];
      path.unshift(file.name);
    }
    return './' + path.join('/');
  }

  flattenDirectory(id: string) {
    const ret: ElementInfo[] = [];
    const childrenMap: Record<string, ElementInfo[]> = {};
    this.elements.forEach(element => {
      if (element.parentId) {
        if (!childrenMap[element.parentId]) {
          childrenMap[element.parentId] = [];
        }
        childrenMap[element.parentId].push(element);
      }
    });
    const travel = (node: ElementInfo) => {
      ret.push(node);
      if (node.type === 'directory') {
        const children = childrenMap[node.id] ?? [];
        children.forEach(travel);
      }
    };
    travel(this.elementMap[id]);
    return ret;
  }
}
