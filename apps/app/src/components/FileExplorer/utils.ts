import {
  DirectoryItemTypeExtended,
  ExplorerItemType,
  ExplorerItemTypeExtended,
} from './types';

export function createExtendedItems(items: ExplorerItemType[]) {
  const extendItems = (
    items: ExplorerItemType[],
    parent: DirectoryItemTypeExtended | null
  ): ExplorerItemTypeExtended[] => {
    return items.map(item => {
      let newItem: ExplorerItemTypeExtended = null!;
      if (item.type === 'file') {
        newItem = {
          ...item,
          parent: parent,
        };
      } else {
        newItem = {
          ...item,
          parent: parent,
          content: [],
        };
        newItem.content = extendItems(item.content, newItem);
      }
      return newItem;
    });
  };
  return sortExplorerItems(extendItems(items, null));
}

export function sortItemsInline<T extends ExplorerItemType>(items: T[]) {
  items.sort((a, b) => {
    if (a.type !== b.type) {
      return a.type === 'directory' ? -1 : 1;
    }
    return a.name.localeCompare(b.name);
  });
  return items;
}

export function sortExplorerItems<T extends ExplorerItemType>(items: T[]) {
  const sortItems = (items: T[]): T[] => {
    return sortItemsInline([...items]).map(item => {
      if (item.type === 'directory') {
        return {
          ...item,
          content: sortItems(item.content as any),
        };
      } else {
        return item;
      }
    });
  };
  return sortItems(items);
}

export function getDisplayList(
  items: ExplorerItemType[],
  expandedDirectories: Record<string, boolean>
) {
  const ret: ExplorerItemType[] = [];
  const travel = (items: ExplorerItemType[]) => {
    items.forEach(item => {
      ret.push(item);
      if (item.type === 'directory' && expandedDirectories[item.id]) {
        travel(item.content);
      }
    });
  };
  travel(items);

  return ret;
}
