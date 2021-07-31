import { useWorkspaceModel, useWorkspaceState } from './EditorModule';
import { FileTab } from './FileTab';

export function EditorTabs() {
  const { tabs, activeTabId: activeFile, dirtyMap } = useWorkspaceState();
  const workspaceModel = useWorkspaceModel();
  return (
    <div tw="flex space-x-0.5 overflow-hidden">
      {tabs.map(tab => (
        <FileTab
          key={tab.id}
          name={tab.name}
          isActive={tab.id === activeFile}
          onOpen={() => workspaceModel.openFile(tab.id)}
          onClose={() => workspaceModel.closeFile(tab.id)}
          hasChanges={dirtyMap[tab.id]}
        />
      ))}
    </div>
  );
}
