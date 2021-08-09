import * as R from 'remeda';
import { doFn } from '../lib/helper';
import { FileTreeHelper } from '../lib/tree';
import { CodeEditor } from '../CodeEditor';
import { IAPIService, InitWorkspaceOptions, TreeNode } from '../types';
import { BundlerService } from '../services/BundlerService';
import { EditorStateService } from '../services/EditorStateService';
import { BaseWorkspaceModel } from './BaseWorkspaceModel';

function randomHash() {
  return R.randomString(15);
}

export class WorkspaceModel extends BaseWorkspaceModel {
  private fileHashMap: Map<string, string> = new Map();
  private workspaceId: string = null!;
  constructor(
    codeEditor: CodeEditor,
    apiService: IAPIService,
    private editorStateService: EditorStateService,
    private bundlerService: BundlerService
  ) {
    super(codeEditor, apiService, 'WorkspaceModel');
  }

  async init(options: InitWorkspaceOptions) {
    const tabsState = this.editorStateService.loadTabsState();
    this.workspaceId = options.workspaceId;
    this.fileHashMap = options.fileHashMap;
    this.setState(draft => {
      draft.activeTabId = tabsState.activeTabId;
      draft.tabs = tabsState.tabs;
      draft.nodes = options.nodes;
    });
    const pathHelper = new FileTreeHelper(this.state.nodes);
    await Promise.all(
      this.state.nodes.map(async node => {
        if (node.type === 'file') {
          this.codeEditor.addFile({
            id: node.id,
            path: pathHelper.getPath(node.id),
            source: await this.apiService.getFileContent(
              node.contentUrl!,
              this.fileHashMap.get(node.id)
            ),
          });
        }
      })
    );
    this.bundlerService.init();
    this.bundlerService.setInputFile('./index.tsx');
    this.bundlerService.loadCode();
    this.codeEditor.addEventListener('modified', ({ fileId, hasChanges }) => {
      this.setState(draft => {
        if (hasChanges) {
          draft.dirtyMap[fileId] = hasChanges;
        } else {
          delete draft.dirtyMap[fileId];
        }
      });
    });
    this.codeEditor.addEventListener('saved', ({ fileId, content }) => {
      this.setState(draft => {
        delete draft.dirtyMap[fileId];
      });
      const newHash = randomHash();
      void this.apiService.updateNode({
        id: fileId,
        content,
        hash: newHash,
      });
      this.fileHashMap.set(fileId, newHash);
      this.bundlerService.loadCode();
    });
    this.codeEditor.addEventListener('opened', ({ fileId }) => {
      this._openTab(fileId);
      this._syncTabs();
    });
    this.codeEditor.addEventListener('errorsChanged', ({ diffErrorMap }) => {
      this.setState(draft => {
        Object.keys(diffErrorMap).forEach(fileId => {
          if (diffErrorMap[fileId]) {
            draft.nodeState[fileId] = 'error';
          } else {
            delete draft.nodeState[fileId];
          }
        });
      });
    });
    if (tabsState.activeTabId) {
      this.codeEditor.openFile(tabsState.activeTabId);
    }
  }

  async removeNode(nodeId: string) {
    void this.apiService.deleteNode(nodeId);
    const node = this._getNodeById(nodeId);
    const nodesToRemove = doFn(() => {
      if (node.type === 'directory') {
        const treeHelper = new FileTreeHelper(this.state.nodes);
        return treeHelper.flattenDirectory(nodeId);
      }
      return [node];
    });
    nodesToRemove.forEach(node => {
      if (node.type === 'file') {
        this.codeEditor.removeFile(node.id);
      }
    });
    const removedMap = R.indexBy(nodesToRemove, x => x.id);
    this.setState(draft => {
      if (draft.activeTabId && removedMap[draft.activeTabId]) {
        draft.activeTabId = null;
      }
      draft.tabs = draft.tabs.filter(x => !removedMap[x.id]);
      if (!draft.activeTabId && draft.tabs.length) {
        draft.activeTabId = draft.tabs[0].id;
      }
      draft.nodes = draft.nodes.filter(x => !removedMap[x.id]);
    });
    this.codeEditor.openFile(this.state.activeTabId);
    this._syncTabs();
    this.bundlerService.loadCode();
  }

  async renameNode(nodeId: string, name: string) {
    void this.apiService.updateNode({ id: nodeId, name });
    this.setState(draft => {
      draft.nodes.forEach(item => {
        if (item.id === nodeId) {
          item.name = name;
        }
      });
      draft.tabs.forEach(item => {
        if (item.id === nodeId) {
          item.name = name;
        }
      });
    });
    const treeHelper = new FileTreeHelper(this.state.nodes);
    const renameNodes = treeHelper.flattenDirectory(nodeId);
    renameNodes.forEach(node => {
      if (node.type === 'file') {
        this.codeEditor.changeFilePath(node.id, treeHelper.getPath(node.id));
      }
    });
    this.bundlerService.loadCode();
  }

  openFile(id: string) {
    super.openFile(id);
    this._syncTabs();
  }

  closeFile(id: string) {
    super.closeFile(id);
    this._syncTabs();
  }

  addNew(newNode: TreeNode) {
    const nodeId = newNode.id;
    const hash = randomHash();
    this.fileHashMap.set(nodeId, hash);
    void this.apiService.addNode({
      ...newNode,
      workspaceId: this.workspaceId,
      hash,
    });
    this.setState(draft => {
      draft.nodes.push(newNode);
    });
    if (newNode.type === 'directory') {
      return;
    }
    const pathHelper = new FileTreeHelper(this.state.nodes);
    this.codeEditor.addFile({
      id: nodeId,
      path: pathHelper.getPath(nodeId),
      source: '',
    });
    this.openFile(nodeId);
    requestAnimationFrame(() => {
      this.codeEditor.focus();
    });
  }

  dispose() {
    this.bundlerService.dispose();
    this.codeEditor.dispose();
  }

  setReadOnly(readOnly: boolean) {
    this.codeEditor.setReadOnly(readOnly);
  }

  ////

  private _syncTabs() {
    const { activeTabId, tabs } = this.state;
    this.editorStateService.updateTabsState({
      activeTabId,
      tabs,
    });
  }
}
