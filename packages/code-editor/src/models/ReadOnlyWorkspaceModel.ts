import { CodeEditor } from '../CodeEditor';
import { FileTreeHelper, findFileByPath } from '../lib/tree';
import { BundlerService } from '../services/BundlerService';
import { IAPIService, InitReadOnlyWorkspaceOptions } from '../types';
import { BaseWorkspaceModel } from './BaseWorkspaceModel';

export class ReadOnlyWorkspaceModel extends BaseWorkspaceModel {
  constructor(
    codeEditor: CodeEditor,
    apiService: IAPIService,
    private bundlerService: BundlerService
  ) {
    super(codeEditor, apiService, 'WorkspaceTreeModel');
  }

  async init(options: InitReadOnlyWorkspaceOptions) {
    const { defaultOpenFiles, nodes } = options;
    this.codeEditor.setReadOnly(true);
    this._resetState();
    const pathHelper = new FileTreeHelper(nodes);
    const tree = pathHelper.buildRecTree();
    const tabs = defaultOpenFiles
      .map(path => findFileByPath(tree, path))
      .map(node => ({
        id: node.id,
        name: node.name,
      }));
    this.setState(draft => {
      draft.activeTabId = tabs[0].id;
      draft.tabs = tabs;
      draft.nodes = nodes;
    });
    await this._addNodesToEditor();
    if (this.state.activeTabId) {
      this.codeEditor.openFile(this.state.activeTabId);
    }

    this.bundlerService.init();
    this.bundlerService.setInputFile('./index.tsx');
    this.bundlerService.loadCode();
  }

  async removeNode() {
    throw new Error('Not supported');
  }
  async renameNode() {
    throw new Error('Not supported');
  }

  addNew() {
    throw new Error('Not supported');
  }

  ////
}
