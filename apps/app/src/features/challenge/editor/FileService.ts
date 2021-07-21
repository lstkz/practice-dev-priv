import * as R from 'remeda';
import { FileNode, NodeId, TreeNode } from 'src/types';

const testContent: Record<NodeId, string> = {
  1: `
  import React from "react";
  import ReactDOM from "react-dom";
  
  function App() {
    const [count, setCount] = React.useState(0);
    return (
      <div>
        <h2>
          Count: <span data-test="count">{count}</span>
        </h2>
        <button
          data-test="increase-btn"
          onClick={() => {
            setCount(count + 1);
          }}
        >
          increase
        </button>
      </div>
    );
  }
  
  const rootElement = document.getElementById("root")!;
  ReactDOM.unmountComponentAtNode(rootElement);
  
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    rootElement
  );
`.trimStart(),
  2: `
export function getFoo() {
  return 0;
}
  `.trimStart(),
  4: `
export function Button() {
  return <button>foo</button>;
}
`.trimStart(),
};

const testFiles: Record<number, TreeNode[]> = {
  1: [
    {
      id: '1',
      type: 'file',
      name: 'index.tsx',
    },
    {
      id: '2',
      type: 'file',
      name: 'foo.ts',
    },
    {
      id: '3',
      type: 'directory',
      name: 'components',
    },
    {
      id: '4',
      type: 'file',
      name: 'Button.tsx',
      parentId: '3',
    },
  ],
};

export class FileService {
  private nodeMap: Record<string, TreeNode> = {};
  private nodeIds: Set<string> = new Set();

  constructor(private challengeId: number) {}

  async loadNodes() {
    const baseNodes = testFiles[this.challengeId];
    const localNodes = this.getLocalNodes();
    localNodes.forEach(item => {
      this.nodeIds.add(item.id);
    });
    const localElementMap = R.indexBy(localNodes, x => x.id);
    const ret: TreeNode[] = [...localNodes];
    baseNodes.forEach(file => {
      if (!localElementMap[file.id]) {
        ret.push(file);
      }
    });
    this.nodeMap = R.indexBy(ret, x => x.id);
    return ret.map(R.clone);
  }

  async loadFileContent(id: NodeId): Promise<string> {
    const content = localStorage[this.getFileContentKey(id)];
    if (content != null) {
      return content;
    }
    return testContent[id] ?? '';
  }

  async saveFile(id: NodeId, content: string) {
    this.getFileById(id);
    this.nodeIds.add(id);
    this.updateNode(id);
    this.updateIds();
    this.updateFileContent(id, content);
  }

  renameNode(id: NodeId, name: string) {
    const node = this.nodeMap[id];
    node.name = name;
    this.nodeIds.add(id);
    this.updateNode(id);
    this.updateIds();
  }

  addNew(values: TreeNode) {
    this.nodeMap[values.id] = values;
    this.nodeIds.add(values.id);
    this.updateNode(values.id);
    this.updateIds();
    return R.clone(this.nodeMap[values.id]);
  }

  removeMultiple(ids: NodeId[]) {
    ids.forEach(id => {
      delete this.nodeMap[id];
      this.updateNode(id);
      this.nodeIds.delete(id);
      delete localStorage[this.getFileContentKey(id)];
    });
    this.updateIds();
  }

  private getFileById(id: NodeId) {
    const file = this.nodeMap[id];
    if (!file) {
      throw new Error("Can't find file: " + id);
    }
    if (file.type !== 'file') {
      throw new Error('Not a file');
    }
    return file;
  }

  private updateFileContent(id: NodeId, content: string) {
    localStorage[this.getFileContentKey(id)] = content;
  }

  private updateIds() {
    localStorage[this.getChallengeKey()] = JSON.stringify(
      Array.from(this.nodeIds.values())
    );
  }

  private updateNode(id: NodeId) {
    localStorage[this.getFileNodeKey(id)] = JSON.stringify(this.nodeMap[id]);
  }

  private getChallengeKey() {
    return `challenge_elements_${this.challengeId}`;
  }

  private getFileNodeKey(id: NodeId) {
    return `${this.getChallengeKey()}_${id}`;
  }

  private getFileContentKey(id: NodeId) {
    return `${this.getChallengeKey()}_${id}_content`;
  }

  private getLocalNodeIds() {
    try {
      const ids: string[] = JSON.parse(localStorage[this.getChallengeKey()]);
      if (!Array.isArray(ids)) {
        return [];
      }
      return ids;
    } catch (e) {
      return [];
    }
  }
  private getLocalNodes() {
    const ids = this.getLocalNodeIds();
    return ids.map(id => this.getLocalNode(id)!).filter(x => x);
  }
  private getLocalNode(id: string) {
    try {
      const node: FileNode = JSON.parse(localStorage[this.getFileNodeKey(id)]);
      return node;
    } catch (e) {
      return null;
    }
  }
}
