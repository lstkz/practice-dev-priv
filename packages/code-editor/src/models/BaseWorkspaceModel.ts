import { ModelState, ModelStateUpdater } from '../lib/ModelState';
import { CodeEditor } from '../CodeEditor';
import {
  IWorkspaceModel,
  TreeNode,
  WorkspaceState,
  IAPIService,
} from '../types';
import { FileTreeHelper } from '../lib/tree';
import { BundlerService } from '../services/BundlerService';

function getDefaultState(): WorkspaceState {
  return {
    activeTabId: null,
    tabs: [],
    dirtyMap: {},
    nodes: [],
    nodeState: {},
  };
}

const TODO_INPUT_FILE = './index.tsx';

export abstract class BaseWorkspaceModel implements IWorkspaceModel {
  protected modelState: ModelState<WorkspaceState> = null!;

  constructor(
    protected codeEditor: CodeEditor,
    protected apiService: IAPIService,
    protected bundlerService: BundlerService,
    name: string
  ) {
    this.modelState = new ModelState(getDefaultState(), name);
  }

  public getModelState() {
    return this.modelState;
  }

  protected get state() {
    return this.modelState.state;
  }

  protected _resetState() {
    this.setState(_ => getDefaultState());
  }

  protected _openTab(id: string) {
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
  }

  protected _getNodeById(id: string) {
    const { nodes } = this.state;
    return nodes.find(x => x.id === id)!;
  }

  protected async _addNodesToEditor() {
    const { nodes } = this.state;
    const pathHelper = new FileTreeHelper(nodes);

    await Promise.all(
      nodes.map(async node => {
        if (node.type === 'file') {
          this.codeEditor.addFile({
            id: node.id,
            path: pathHelper.getPath(node.id),
            source: await this.apiService.getFileContent(node.contentUrl!),
          });
        }
      })
    );
  }

  protected _loadCode() {
    this.bundlerService.init();
    this.bundlerService.loadCode(this._getLoadCodeOptions());
  }

  protected _getLoadCodeOptions() {
    return {
      fileMap: this.codeEditor.getFileMap(),
      inputFile: TODO_INPUT_FILE,
    };
  }

  protected setState(updater: ModelStateUpdater<WorkspaceState>) {
    this.modelState.update(updater);
  }

  openFile(id: string) {
    this._openTab(id);
    this.codeEditor.openFile(id);
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
  }

  abstract removeNode(nodeId: string): Promise<void>;
  abstract renameNode(nodeId: string, name: string): Promise<void>;
  abstract addNew(newNode: TreeNode): void;
}
