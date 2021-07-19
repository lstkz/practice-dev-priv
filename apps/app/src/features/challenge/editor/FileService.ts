import * as R from 'remeda';

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
  parentId?: string;
}

export interface DirectoryInfo {
  id: string;
  type: 'directory';
  name: string;
  parentId?: string;
}

export type ElementInfo = FileInfo | DirectoryInfo;

export class FileService {
  constructor(private challengeId: number) {}

  async loadElements() {
    const baseFiles = testFiles[this.challengeId];
    const localFiles = this.getLocalFiles();
    const localFilesMap = R.indexBy(localFiles, x => x.id);
    const ret: ElementInfo[] = [...localFiles];
    baseFiles.forEach(file => {
      if (!localFilesMap[file.id]) {
        ret.push(file);
      }
    });
    return ret;
  }

  async saveFile(id: string, content: string) {
    const file = this.getLocalElement(id);
    if (!file) {
      throw new Error("Can't find file: " + id);
    }
    if (file.type !== 'file') {
      throw new Error('Not a file');
    }
    file.content = content;
    localStorage[this.getFileElement(id)] = JSON.stringify(file);
  }

  private getChallengeKey() {
    return `challenge_elements_${this.challengeId}`;
  }

  private getFileElement(id: string) {
    return `${this.getChallengeKey()}_${id}`;
  }

  private getLocalElementIds() {
    try {
      const ids: string[] = JSON.parse(localStorage[this.getChallengeKey()]);
      return ids;
    } catch (e) {
      return [];
    }
  }
  private getLocalFiles() {
    const ids = this.getLocalElementIds();
    return ids.map(id => this.getLocalElement(id)!).filter(x => x);
  }
  private getLocalElement(id: string) {
    try {
      const element: ElementInfo = JSON.parse(
        localStorage[this.getFileElement(id)]
      );
      return element;
    } catch (e) {
      return null;
    }
  }
}
