import React from 'react';
import * as R from 'remeda';
import {
  DirectoryItemType,
  ExplorerItemType,
} from 'src/components/FileExplorer/types';
import { FileExplorer } from '../../components/FileExplorer/FileExplorer';
import { useEditorActions, useEditorState } from './editor/EditorModule';

export function FileExplorerTab() {
  const { elements, isLoaded } = useEditorState();
  const { openFile, addNew, removeElement } = useEditorActions();
  const items = React.useMemo(() => {
    if (!isLoaded) {
      return [];
    }
    const mapped: ExplorerItemType[] = elements.map(elem => {
      if (elem.type === 'file') {
        return {
          id: elem.id,
          type: 'file',
          name: elem.name,
        };
      }
      return {
        id: elem.id,
        type: 'directory',
        name: elem.name,
        content: [],
      };
    });
    const elementMap = R.indexBy(elements, x => x.id);
    const mappedMap = R.indexBy(mapped, x => x.id);
    mapped.forEach(item => {
      const element = elementMap[item.id];
      if (element.parentId) {
        (mappedMap[element.parentId] as DirectoryItemType).content.push(item);
      }
    });
    return mapped.filter(item => !elementMap[item.id].parentId);
  }, [isLoaded]);
  if (!isLoaded) {
    return null;
  }
  return (
    <FileExplorer
      items={items}
      onOpenFile={openFile}
      onNewFile={addNew}
      onElementRemoved={removeElement}
    />
  );
}
