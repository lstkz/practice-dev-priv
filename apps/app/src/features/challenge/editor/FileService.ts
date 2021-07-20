import * as R from 'remeda';
import { AddNewElementValues } from 'src/types';

const testFiles: Record<number, ElementInfo[]> = {
  1: [
    {
      id: '1',
      type: 'file',
      name: 'index.tsx',
      content: `
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
    },
    {
      id: '2',
      type: 'file',
      name: 'foo.ts',
      content: `
export function getFoo() {
  return 0;
}
`.trimStart(),
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
      content: `
export function Button() {
return <button>foo</button>;
}
`.trimStart(),
    },
  ],
};

export interface FileInfo {
  id: string;
  type: 'file';
  name: string;
  content: string;
  parentId?: string | null;
}

export interface DirectoryInfo {
  id: string;
  type: 'directory';
  name: string;
  parentId?: string | null;
}

export type ElementInfo = FileInfo | DirectoryInfo;

export class FileService {
  elementMap: Record<string, ElementInfo> = {};
  elementIds: Set<string> = new Set();

  constructor(private challengeId: number) {}

  async loadElements() {
    const baseElements = testFiles[this.challengeId];
    const localElements = this.getLocalElements();
    localElements.forEach(item => {
      this.elementIds.add(item.id);
    });
    const localElementMap = R.indexBy(localElements, x => x.id);
    const ret: ElementInfo[] = [...localElements];
    baseElements.forEach(file => {
      if (!localElementMap[file.id]) {
        ret.push(file);
      }
    });
    this.elementMap = R.indexBy(ret, x => x.id);
    return ret.map(R.clone);
  }

  async saveFile(id: string, content: string) {
    const file = this.elementMap[id];
    if (!file) {
      throw new Error("Can't find file: " + id);
    }
    if (file.type !== 'file') {
      throw new Error('Not a file');
    }
    file.content = content;
    this.elementIds.add(id);
    this.updateFile(id);
    this.updateIds();
  }

  addNew(values: AddNewElementValues) {
    if (values.type === 'file') {
      this.elementMap[values.id] = {
        ...values,
        content: '',
      } as FileInfo;
    } else {
      this.elementMap[values.id] = values as DirectoryInfo;
    }
    this.elementIds.add(values.id);
    this.updateFile(values.id);
    this.updateIds();
    return R.clone(this.elementMap[values.id]);
  }

  removeMultiple(ids: string[]) {
    ids.forEach(id => {
      delete this.elementMap[id];
      this.updateFile(id);
      this.elementIds.delete(id);
    });
    this.updateIds();
  }

  private updateIds() {
    localStorage[this.getChallengeKey()] = JSON.stringify(
      Array.from(this.elementIds.values())
    );
  }

  private updateFile(id: string) {
    localStorage[this.getFileElementKey(id)] = JSON.stringify(
      this.elementMap[id]
    );
  }

  private getChallengeKey() {
    return `challenge_elements_${this.challengeId}`;
  }

  private getFileElementKey(id: string) {
    return `${this.getChallengeKey()}_${id}`;
  }

  private getLocalElementIds() {
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
  private getLocalElements() {
    const ids = this.getLocalElementIds();
    return ids.map(id => this.getLocalElement(id)!).filter(x => x);
  }
  private getLocalElement(id: string) {
    try {
      const element: ElementInfo = JSON.parse(
        localStorage[this.getFileElementKey(id)]
      );
      return element;
    } catch (e) {
      return null;
    }
  }
}
