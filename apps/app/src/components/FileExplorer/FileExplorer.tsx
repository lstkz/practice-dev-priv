import { createModuleContext, useActions, useImmer } from 'context-api';
import * as uuid from 'uuid';
import React from 'react';
import { ActionIcon } from './ActionIcon';
import {
  createExtendedItems,
  getDisplayList,
  sortExplorerItems,
  sortItemsInline,
} from './utils';
import { FileExplorerItemList } from './FileExplorerItemList';
import { NewDirectoryIcon } from './icons/NewDirectoryIcon';
import { NewFileIcon } from './icons/NewFileIcon';
import {
  DirectoryItemType,
  ExplorerItemType,
  ExplorerItemTypeExtended,
  NewFileType,
  WritableFileItem,
} from './types';
import { doFn } from '../../common/helper';
import { AddNewElementValues } from 'src/types';

interface FileExplorerProps {
  items: ExplorerItemType[];
  onOpenFile: (id: string) => void;
  onRename: (id: string, name: string) => void;
  onNewFile: (values: AddNewElementValues) => void;
  onElementRemoved: (id: string) => void;
}

interface State {
  hasFocus: boolean;
  items: ExplorerItemType[];
  activeItemId: string | null;
  navigationActiveItemId: string | null;
  expandedDirectories: Record<string, boolean>;
}

interface ItemAPI {
  rename: () => void;
  confirmDelete: () => void;
}

interface Actions {
  toggleDirectoryExpanded: (id: string) => void;
  setActive: (id: string) => void;
  removeItem: (id: string) => void;
  updateItemName: (id: string, name: string) => void;
  addNew: (type: NewFileType, name: string, parentId: string | null) => void;
  registerItem: (id: string, api: ItemAPI | null) => void;
  openFile: (id: string) => void;
}

const [Provider, useContext] = createModuleContext<State, Actions>();

function _findItem(
  id: string,
  items: WritableFileItem[]
): { items: WritableFileItem[]; item: WritableFileItem } {
  for (const item of items) {
    if (item.id === id) {
      return { items, item };
    }
    if (item.type === 'directory') {
      const ret = _findItem(id, item.content);
      if (ret) {
        return ret;
      }
    }
  }
  return null!;
}

export function FileExplorer(props: FileExplorerProps) {
  const { onOpenFile, onNewFile, onElementRemoved, onRename } = props;
  const [state, setState] = useImmer<State>({
    hasFocus: false,
    items: React.useMemo(() => sortExplorerItems(props.items), []),
    activeItemId: null,
    navigationActiveItemId: null,
    expandedDirectories: {},
  });
  const wrapperRef = React.useRef<HTMLDivElement>(null!);
  const itemApiRef = React.useRef<Record<string, ItemAPI>>({});
  const [isAdding, setIsAdding] = React.useState<NewFileType | null>(null);
  const { activeItemId, navigationActiveItemId, expandedDirectories, items } =
    state;
  const actions = useActions<Actions>({
    registerItem: (id, api) => {
      if (api) {
        itemApiRef.current[id] = api;
      } else {
        delete itemApiRef.current[id];
      }
    },
    toggleDirectoryExpanded: id => {
      setState(draft => {
        if (draft.expandedDirectories[id]) {
          delete draft.expandedDirectories[id];
        } else {
          draft.expandedDirectories[id] = true;
        }
      });
    },
    setActive: id => {
      setState(draft => {
        draft.activeItemId = id;
      });
    },
    addNew: (type, name, parentId) => {
      const id = uuid.v4();
      setState(draft => {
        const newItem =
          type === 'directory'
            ? {
                type,
                name,
                id,
                content: [],
              }
            : { type, name, id };
        let rootItems = draft.items;
        if (parentId) {
          const parent = _findItem(parentId, draft.items).item;
          rootItems = (parent as DirectoryItemType).content;
        }
        rootItems.push(newItem);
        sortItemsInline(rootItems);
      });
      onNewFile({
        id,
        name,
        parentId,
        type,
      });
    },
    removeItem: id => {
      setState(draft => {
        const { item, items } = _findItem(id, draft.items);
        items.splice(items.indexOf(item), 1);
      });
      onElementRemoved(id);
    },
    updateItemName: (id, name) => {
      setState(draft => {
        _findItem(id, draft.items).item.name = name;
        draft.activeItemId = id;
        draft.navigationActiveItemId = id;
      });
      onRename(id, name);
    },
    openFile: id => {
      onOpenFile(id);
    },
  });
  const extendedItems = React.useMemo(() => {
    return createExtendedItems(items);
  }, [items]);
  const itemMap = React.useMemo(() => {
    const itemMap: Record<string, ExplorerItemType> = {};
    const indexItems = (items: ExplorerItemTypeExtended[]) => {
      items.forEach(item => {
        itemMap[item.id] = item;
        if (item.type === 'directory') {
          indexItems(item.content);
        }
      });
    };
    indexItems(extendedItems);
    return itemMap;
  }, [extendedItems]);
  const displayList = React.useMemo(() => {
    return getDisplayList(items, expandedDirectories);
  }, [items, expandedDirectories]);

  return (
    <Provider state={state} actions={actions}>
      <div
        ref={wrapperRef}
        tw="text-sm text-gray-400"
        onFocus={() => {
          setState(draft => {
            draft.hasFocus = true;
          });
        }}
        onBlur={() => {
          setState(draft => {
            draft.hasFocus = false;
            draft.navigationActiveItemId = null;
          });
        }}
        onKeyDown={e => {
          const shouldPrevent = doFn(() => {
            switch (e.key) {
              case 'ArrowRight': {
                if (!navigationActiveItemId) {
                  return true;
                }
                const item = itemMap[navigationActiveItemId];
                if (item.type === 'directory') {
                  setState(draft => {
                    draft.expandedDirectories[navigationActiveItemId] = true;
                  });
                } else {
                  setState(draft => {
                    draft.activeItemId = navigationActiveItemId;
                    draft.navigationActiveItemId = null;
                  });
                }
                return true;
              }
              case 'ArrowLeft': {
                if (!navigationActiveItemId) {
                  return true;
                }
                const item = itemMap[navigationActiveItemId];
                if (item.type === 'directory') {
                  setState(draft => {
                    delete draft.expandedDirectories[navigationActiveItemId];
                  });
                }
                return true;
              }
              case 'ArrowUp':
              case 'ArrowDown': {
                if (!navigationActiveItemId && !activeItemId) {
                  setState(draft => {
                    draft.navigationActiveItemId = displayList[0]?.id;
                  });
                  return true;
                }
                const idx =
                  displayList.findIndex(
                    item => item.id === (navigationActiveItemId ?? activeItemId)
                  ) + (e.key === 'ArrowDown' ? 1 : -1);
                if (displayList[idx]) {
                  setState(draft => {
                    draft.navigationActiveItemId = displayList[idx].id;
                  });
                }
                return true;
              }
              case 'Enter': {
                const id = navigationActiveItemId || activeItemId;
                if (id) {
                  itemApiRef.current[id]?.rename();
                }
                return true;
              }
              case 'Delete': {
                const id = navigationActiveItemId || activeItemId;
                if (id) {
                  itemApiRef.current[id]?.confirmDelete();
                }
                return true;
              }
            }
            return false;
          });
          if (shouldPrevent) {
            e.preventDefault();
          }
        }}
      >
        <div tw="flex">
          <div tw="text-xs font-semibold tracking-wider mb-1 ">FILES</div>
          <div tw="ml-auto space-x-2">
            <ActionIcon
              title="New File"
              onClick={() => {
                setIsAdding('file');
              }}
            >
              <NewFileIcon />
            </ActionIcon>
            <ActionIcon
              title="New Directory"
              onClick={() => {
                setIsAdding('directory');
              }}
            >
              <NewDirectoryIcon />
            </ActionIcon>
          </div>
        </div>
        <div tw="-mx-3">
          <FileExplorerItemList
            isAdding={isAdding}
            onNewAdded={(type, name) => {
              actions.addNew(type, name, null);
              setIsAdding(null);
            }}
            onNewCancelled={() => {
              setIsAdding(null);
            }}
            nestedLevel={0}
            items={items}
          />
        </div>
      </div>
    </Provider>
  );
}

export function useFileExplorerActions() {
  return useContext().actions;
}

export function useFileExplorerState() {
  return useContext().state;
}
