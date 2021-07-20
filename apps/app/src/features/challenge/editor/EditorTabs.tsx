import { useEditorActions, useEditorState } from './EditorModule';
import { FileTab } from './FileTab';

export function EditorTabs() {
  const { tabs, activeTabId: activeFile, dirtyMap } = useEditorState();
  const { closeFile, openFile } = useEditorActions();
  return (
    <div tw="flex space-x-0.5 overflow-hidden">
      {tabs.map(tab => (
        <FileTab
          key={tab.id}
          name={tab.name}
          isActive={tab.id === activeFile}
          onOpen={() => openFile(tab.id)}
          onClose={() => closeFile(tab.id)}
          hasChanges={dirtyMap[tab.id]}
        />
      ))}
    </div>
  );
}
