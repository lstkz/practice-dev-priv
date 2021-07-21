import * as R from 'remeda';
import { TreeNode } from 'src/types';

export class FileTreeHelper {
  private nodeMap: Record<string, TreeNode>;

  constructor(private nodes: TreeNode[]) {
    this.nodeMap = R.indexBy(nodes, x => x.id);
  }

  getPath(id: string) {
    let file = this.nodeMap[id];
    const path = [file.name];
    while (file.parentId) {
      file = this.nodeMap[file.parentId];
      path.unshift(file.name);
    }
    return './' + path.join('/');
  }

  flattenDirectory(id: string) {
    const ret: TreeNode[] = [];
    const childrenMap: Record<string, TreeNode[]> = {};
    this.nodes.forEach(node => {
      if (node.parentId) {
        if (!childrenMap[node.parentId]) {
          childrenMap[node.parentId] = [];
        }
        childrenMap[node.parentId].push(node);
      }
    });
    const travel = (node: TreeNode) => {
      ret.push(node);
      if (node.type === 'directory') {
        const children = childrenMap[node.id] ?? [];
        children.forEach(travel);
      }
    };
    travel(this.nodeMap[id]);
    return ret;
  }
}
