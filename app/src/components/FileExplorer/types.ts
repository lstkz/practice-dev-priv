export type ExplorerItemType = FileItemType | DirectoryItemType;

export interface FileItemType {
  id: string;
  type: 'file';
  name: string;
  hasChanges?: boolean;
}

export interface DirectoryItemType {
  id: string;
  type: 'directory';
  name: string;
  content: ExplorerItemType[];
}

export interface FileItemTypeExtended extends FileItemType {
  parent: DirectoryItemTypeExtended | null;
}
export interface DirectoryItemTypeExtended extends DirectoryItemType {
  parent: DirectoryItemTypeExtended | null;
  content: ExplorerItemTypeExtended[];
}

export type ExplorerItemTypeExtended =
  | FileItemTypeExtended
  | DirectoryItemTypeExtended;
