import * as R from 'remeda';
import { createModuleContext, useActions, useImmer } from 'context-api';
import React from 'react';
import { ActionIcon } from './ActionIcon';
import {
  createExtendedItems,
  getDisplayList,
  sortExplorerItems,
} from './utils';
import { FileExplorerItemList } from './FileExplorerItemList';
import { NewDirectoryIcon } from './icons/NewDirectoryIcon';
import { NewFileIcon } from './icons/NewFileIcon';
import { ExplorerItemType, ExplorerItemTypeExtended } from './types';
import { doFn } from '../../common/helper';

interface FileExplorerProps {
  items: ExplorerItemType[];
}

interface State {
  hasFocus: boolean;
  items: ExplorerItemType[];
  activeItemId: string | null;
  expandedDirectories: Record<string, boolean>;
}

interface Actions {
  toggleDirectoryExpanded: (id: string) => void;
  setActive: (id: string) => void;
}

const [Provider, useContext] = createModuleContext<State, Actions>();

export function FileExplorer(props: FileExplorerProps) {
  const [state, setState, _getState] = useImmer<State>({
    hasFocus: false,
    items: React.useMemo(() => sortExplorerItems(props.items), []),
    activeItemId: null,
    expandedDirectories: {},
  });
  const { activeItemId, expandedDirectories, items } = state;
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
          });
        }}
        onKeyDown={e => {
          const shouldPrevent = doFn(() => {
            switch (e.key) {
              case 'Tab': {
                return true;
              }
              case 'ArrowUp':
              case 'ArrowDown': {
                if (!activeItemId) {
                  setState(draft => {
                    draft.activeItemId = displayList[0]?.id;
                  });
                  return true;
                }
                const idx =
                  displayList.findIndex(item => item.id === activeItemId) +
                  (e.key === 'ArrowDown' ? 1 : -1);
                if (displayList[idx]) {
                  setState(draft => {
                    draft.activeItemId = displayList[idx].id;
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
            <ActionIcon title="New File">
              <NewFileIcon />
            </ActionIcon>
            <ActionIcon title="New Directory">
              <NewDirectoryIcon />
            </ActionIcon>
          </div>
        </div>
        <div tw="-mx-3">
          <FileExplorerItemList nestedLevel={0} items={items} />
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
