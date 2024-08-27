import { TeamRole } from './Team';

export type Folder = {
  folderId: string;
  title: string;
  description: string;
  createdDate: string;
  isDefault: boolean;
  permissionType?: FolderPermission;
  teamFolderPermissionType?: FolderPermission;
  userTeamPermissionType?: TeamRole;
};

export enum FolderPermission {
  OWNER = 'Owner',
  EDITOR = 'Editor',
  VIEWER = 'Viewer',
}

export const FolderPermissionLabel: Record<FolderPermission, string> = {
  [FolderPermission.OWNER]: 'Owner',
  [FolderPermission.VIEWER]: 'Viewer',
  [FolderPermission.EDITOR]: 'Editor',
};
