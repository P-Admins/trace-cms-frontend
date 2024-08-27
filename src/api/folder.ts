import api from './config';
import { getErrorMessageFromResponse } from '@/lib/utils';
import { Folder, FolderPermission } from '@/types/Folder';
import { GetUserProfileResponse } from './user';

export type CreateFolderResponse = {
  folderId: string;
  title: string;
  createdDate: string;
};
export const createFolder = async (folder: {
  title: string;
  description?: string;
}): Promise<CreateFolderResponse> => {
  try {
    const response = await api.post('/folder', { title: folder.title, description: '' });
    return response.data;
  } catch (err: unknown) {
    console.error(err);
    const error = getErrorMessageFromResponse(err);
    throw new Error(error);
  }
};

export const createTeamFolder = async (params: {
  title: string;
  description?: string;
  teamId: string;
}): Promise<CreateFolderResponse> => {
  try {
    const response = await api.post('/folder/team', params);
    return response.data;
  } catch (err: unknown) {
    console.error(err);
    const error = getErrorMessageFromResponse(err);
    throw new Error(error);
  }
};

export const renameFolder = async (folder: {
  folderId: string;
  title: string;
}): Promise<{ ok: boolean }> => {
  try {
    await api.patch('/folder', {
      folderId: folder.folderId,
      title: folder.title,
    });
    return { ok: true };
  } catch (err: unknown) {
    console.error(err);
    const error = getErrorMessageFromResponse(err);
    throw new Error(error);
  }
};

export const deleteFolder = async (folderId: string): Promise<{ ok: boolean }> => {
  try {
    await api.delete(`/folder/${folderId}`);
    return { ok: true };
  } catch (err: unknown) {
    console.error(err);
    const error = getErrorMessageFromResponse(err);
    throw new Error(error);
  }
};

export const getFolders = async (): Promise<Folder[]> => {
  try {
    const response = await api.get('/folder');
    return response.data;
  } catch (err: unknown) {
    console.error(err);
    const error = getErrorMessageFromResponse(err);
    throw new Error(error);
  }
};

export type GetTeamFoldersResponse = {
  folders: Folder[];
  teamId: string;
  teamName: string;
};
export const getTeamFolders = async (teamId: string): Promise<GetTeamFoldersResponse> => {
  try {
    const response = await api.get(`/folder/team/${teamId}`);
    return response.data;
  } catch (err: unknown) {
    console.error(err);
    const error = getErrorMessageFromResponse(err);
    throw new Error(error);
  }
};

export type ShareFolderWithPeopleRequestParams = {
  folderId: string;
  members: { email: string; permissionType: string }[];
  updatePermissions: { userId: string; permissionType: string }[];
  revokeAccess: string[];
};

export const shareFolderWithPeople = async (
  params: ShareFolderWithPeopleRequestParams
): Promise<{ ok: boolean }> => {
  try {
    await api.post('/folder/users/share', params);
    return { ok: true };
  } catch (err: unknown) {
    console.error(err);
    const error = getErrorMessageFromResponse(err);
    throw new Error(error);
  }
};

export type ShareFolderWithTeamRequestParams = {
  folderId: string;
  teams: { teamId: string; permissionType: string }[];
  updatePermissions: { teamId: string; permissionType: string }[];
  revokeAccess: string[];
};

export const shareFolderWithTeams = async (
  params: ShareFolderWithTeamRequestParams
): Promise<{ ok: boolean }> => {
  try {
    await api.post('/folder/team/share', params);
    return { ok: true };
  } catch (err: unknown) {
    console.error(err);
    const error = getErrorMessageFromResponse(err);
    throw new Error(error);
  }
};

export type ShareFolderRequestParams = {
  people?: ShareFolderWithPeopleRequestParams | null;
  teams?: ShareFolderWithTeamRequestParams | null;
};

export const shareFolder = async (params: ShareFolderRequestParams): Promise<{ ok: boolean }> => {
  const { people: userPermission, teams: teamPermissions } = params;
  try {
    if (
      userPermission?.members.length ||
      userPermission?.revokeAccess.length ||
      userPermission?.updatePermissions.length
    ) {
      await api.post('/folder/users/share', userPermission);
    }
    if (
      teamPermissions?.teams.length ||
      teamPermissions?.revokeAccess.length ||
      teamPermissions?.updatePermissions.length
    ) {
      await api.post('/folder/team/share', teamPermissions);
    }
    return { ok: true };
  } catch (err: unknown) {
    console.error(err);
    const error = getErrorMessageFromResponse(err);
    throw new Error(error);
  }
};

export type GetFolderPermissionsResponse = {
  folderId: string;
  folderName: string;
  users: GetUserProfileResponse[];
  teams: {
    teamId: string;
    name: string;
    description: string | null;
    isOwner: boolean | null;
    profileImageUrl: string | null;
    profileImageThumbnailUrl: string | null;
    profileImageSmallThumbnailUrl: string | null;
    permissionType: FolderPermission;
  }[];
  userInvitations: { email: string; permissionType: FolderPermission }[];
};

export const getFolderPermissions = async (
  folderId: string
): Promise<GetFolderPermissionsResponse> => {
  try {
    const response = await api.get(`/folder/permissions/${folderId}`);
    return response.data;
  } catch (err: unknown) {
    console.error(err);
    const error = getErrorMessageFromResponse(err);
    throw new Error(error);
  }
};
