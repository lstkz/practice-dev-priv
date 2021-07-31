import React from 'react';
import { FileExplorer } from '../../components/FileExplorer/FileExplorer';
import {
  useIsEditorLoaded,
  useWorkspaceModel,
  useWorkspaceState,
} from './editor/EditorModule';

export function FileExplorerTab() {
  const isLoaded = useIsEditorLoaded();
  const { nodes, nodeState } = useWorkspaceState();
  const workspaceModel = useWorkspaceModel();
  if (!isLoaded) {
    return null;
  }
  return (
    <FileExplorer
      lockedNodesMap={{
        1: true,
      }}
      nodeState={nodeState}
      items={nodes}
      onOpenFile={id => workspaceModel.openFile(id)}
      onNewFile={values => workspaceModel.addNew(values)}
      onRemoved={id => workspaceModel.removeNode(id)}
      onRename={(id, name) => workspaceModel.renameNode(id, name)}
    />
  );
}
