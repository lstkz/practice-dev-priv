import * as R from 'remeda';
import { doFn } from 'src/common/helper';
import { FileTreeHelper } from 'src/common/tree';
import { CodeEditor } from 'src/components/CodeEditor/CodeEditor';
import { Workspace, WorkspaceNode, WorkspaceNodeType } from 'src/generated';
import { TreeNode } from 'src/types';
import { APIService } from './APIService';
import { BundlerService } from './BundlerService';
import { EditorStateService } from './EditorStateService';
import { ModelState, ModelStateUpdater } from './ModelState';

interface OpenedTab {
  id: string;
  name: string;
}

export interface WorkspaceState {
  activeTabId: string | null;
  nodes: TreeNode[];
  tabs: OpenedTab[];
  dirtyMap: Record<string, boolean>;
}

function mapWorkspaceNodes(nodes: WorkspaceNode[]) {
  const ret: TreeNode[] = nodes.map(node => {
    if (node.type === WorkspaceNodeType.Directory) {
      return {
        type: 'directory',
        id: node.id,
        name: node.name,
        parentId: node.parentId,
      };
    } else {
      return {
        type: 'file',
        id: node.id,
        name: node.name,
        parentId: node.parentId,
      };
    }
  });
  return ret;
}

function randomHash() {
  return R.randomString(15);
}

export class WorkspaceModel {
  private fileHashMap: Map<string, string> = new Map();
  private modelState: ModelState<WorkspaceState> = null!;
  private workspace: Workspace = null!;

  constructor(
    private codeEditor: CodeEditor,
    private apiService: APIService,
    private editorStateService: EditorStateService,
    private bundlerService: BundlerService
  ) {
    this.modelState = new ModelState(
      {
        activeTabId: null,
        tabs: [],
        dirtyMap: {},
        nodes: [],
      },
      'WorkspaceTreeModel'
    );
  }

  private get state() {
    return this.modelState.state;
  }

  public getModelState() {
    return this.modelState;
  }

  async init(workspace: Workspace) {
    const tabsState = this.editorStateService.loadTabsState();
    this.workspace = workspace;
    workspace.items.forEach(item => {
      this.fileHashMap.set(item.id, item.hash);
    });
    this.setState(draft => {
      draft.activeTabId = tabsState.activeTabId;
      draft.tabs = tabsState.tabs;
      draft.nodes = mapWorkspaceNodes(workspace.items);
    });
    const pathHelper = new FileTreeHelper(this.state.nodes);
    await Promise.all(
      workspace.items.map(async node => {
        if (node.type === 'file') {
          this.codeEditor.addFile({
            id: node.id,
            path: pathHelper.getPath(node.id),
            source: await this.apiService.getFileContent({
              fileId: node.id,
              hash: this.fileHashMap.get(node.id)!,
              workspaceId: workspace.id,
            }),
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
  }

  openFile(id: string) {
    const file = this._getNodeById(id);
    this.setState(draft => {
      draft.activeTabId = id;
      if (!draft.tabs.some(x => x.id === id)) {
        draft.tabs.push({
          id: id,
          name: file.name,
        });
      }
    });
    this.codeEditor.openFile(id);
    this._syncTabs();
  }

  closeFile(id: string) {
    let newActiveId: string | null | -1 = -1;
    this.setState(draft => {
      draft.tabs = draft.tabs.filter(x => x.id !== id);
      if (draft.activeTabId === id) {
        draft.activeTabId = draft.tabs[0]?.id ?? null;
        newActiveId = draft.activeTabId;
      }
    });
    if (newActiveId !== -1) {
      this.codeEditor.openFile(newActiveId);
    }
    const { dirtyMap } = this.state;
    if (dirtyMap[id]) {
      this.setState(draft => {
        delete draft.dirtyMap[id];
      });
      this.codeEditor.revertDirty(id);
    }
    this._syncTabs();
  }

  addNew(newNode: TreeNode) {
    const nodeId = newNode.id;
    const hash = randomHash();
    this.fileHashMap.set(nodeId, hash);
    void this.apiService.addNode({
      ...newNode,
      type:
        newNode.type === 'directory'
          ? WorkspaceNodeType.Directory
          : WorkspaceNodeType.File,
      workspaceId: this.workspace.id,
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

  ////

  private setState(updater: ModelStateUpdater<WorkspaceState>) {
    this.modelState.update(updater);
  }

  private _syncTabs() {
    const { activeTabId, tabs } = this.state;
    this.editorStateService.updateTabsState({
      activeTabId,
      tabs,
    });
  }

  private _getNodeById(id: string) {
    const { nodes } = this.state;
    return nodes.find(x => x.id === id)!;
  }
}
