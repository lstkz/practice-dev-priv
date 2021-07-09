import React from 'react';
import { FileExplorerItem } from './FileExplorerItem';
import { ExplorerItemType } from './types';

interface FileExplorerItemListProps {
  items: ExplorerItemType[];
  nestedLevel: number;
}

export function FileExplorerItemList(props: FileExplorerItemListProps) {
  const { items, nestedLevel } = props;
  return (
    <>
      {items.map(item => (
        <FileExplorerItem
          nestedLevel={nestedLevel}
          item={item}
          key={item.name}
        />
      ))}
    </>
  );
}
