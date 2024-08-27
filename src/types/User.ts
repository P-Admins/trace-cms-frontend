import { FolderPermission } from './Folder';
import { ApplicationRole } from './Other';

export type User = {
  name: string;
  userId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  userAlias: string;
  dateOfBirth: string | null;
  profileImageUrl: string;
  profileImageThumbnailUrl: string;
  profileImageSmallThumbnailUrl: string;
  permissionType: FolderPermission | null;
  organization: string | null;
  usageType: string | null;
  receiveNewsletter: boolean;
  datePasswordChanged: string | null;
  applicationRole: ApplicationRole;
} | null;
