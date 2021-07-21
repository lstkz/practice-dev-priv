import React from 'react';
import { FileExplorer } from '../../components/FileExplorer/FileExplorer';
import { useEditorActions, useEditorState } from './editor/EditorModule';

export function FileExplorerTab() {
  const { nodes, isLoaded } = useEditorState();
  const { openFile, addNew, removeNode, renameNode } = useEditorActions();
  if (!isLoaded) {
    return null;
  }
  return (
    <FileExplorer
      items={nodes}
      onOpenFile={openFile}
      onNewFile={addNew}
      onRemoved={removeNode}
      onRename={renameNode}
    />
  );
}
