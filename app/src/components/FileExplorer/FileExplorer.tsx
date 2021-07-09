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
  ExplorerItemType,
  ExplorerItemTypeExtended,
  NewFileType,
} from './types';
import { doFn } from '../../common/helper';

interface FileExplorerProps {
  items: ExplorerItemType[];
}

interface State {
  hasFocus: boolean;
  items: ExplorerItemType[];
  activeItemId: string | null;
  navigationActiveItemId: string | null;
  expandedDirectories: Record<string, boolean>;
}

interface Actions {
  toggleDirectoryExpanded: (id: string) => void;
  setActive: (id: string) => void;
  addNew: (type: NewFileType, name: string, parentId: string | null) => void;
}

const [Provider, useContext] = createModuleContext<State, Actions>();

export function FileExplorer(props: FileExplorerProps) {
  const [state, setState] = useImmer<State>({
    hasFocus: false,
    items: React.useMemo(() => sortExplorerItems(props.items), []),
    activeItemId: null,
    navigationActiveItemId: null,
    expandedDirectories: {},
  });
  const [isAdding, setIsAdding] = React.useState<NewFileType | null>(null);
  const {
    activeItemId,
    navigationActiveItemId,
    expandedDirectories,
    items,
  } = state;
  const actions = useActions<Actions>({
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
      setState(draft => {
        const id = uuid.v4();
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
          const travel = (items: typeof rootItems) => {
            items.forEach(item => {
              if (item.type === 'directory') {
                if (item.id === parentId) {
                  rootItems = item.content;
                } else {
                  travel(item.content);
                }
              }
            });
          };
          travel(draft.items);
        }
        rootItems.push(newItem);
        sortItemsInline(rootItems);
      });
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
              case 'Tab': {
                return true;
              }
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
            }
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
