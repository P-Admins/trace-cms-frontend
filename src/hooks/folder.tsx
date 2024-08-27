import {
  getFolders,
  getTeamFolders,
  createFolder,
  createTeamFolder,
  deleteFolder,
  renameFolder,
  getFolderPermissions,
  shareFolder,
} from '@/api/folder';
import { getStorageUrl, getUserDisplayName } from '@/lib/utils';
import { Folder } from '@/types/Folder';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from './useAuth';

const folderKeys = {
  all: ['folders'] as const,
  user: () => [...folderKeys.all, 'user'] as const,
  team: (teamId: string) => [...folderKeys.all, 'team', teamId] as const,
  permissions: (folderId: string) => [...folderKeys.all, 'permissions', folderId] as const,
};

export const useGetFoldersQuery = (options: { enabled?: boolean } = {}) => {
  const { auth } = useAuth();

  const { data, isLoading, error } = useQuery({
    enabled: !!auth,
    queryKey: folderKeys.user(),
    queryFn: getFolders,
    retry: 0,
    select: (data) => {
      // default folder first
      const sorted = data.reduce((prev: Folder[], curr: Folder) => {
        curr.isDefault ? prev.unshift(curr) : prev.push(curr);
        return prev;
      }, []);
      return sorted;
    },
  });

  return { folders: data || [], isGetFoldersLoading: isLoading, getFoldersError: error };
};

export const useGetTeamFoldersQuery = (teamId?: string) => {
  const { auth } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: folderKeys.team(teamId as string),
    queryFn: () => getTeamFolders(teamId as string),
    enabled: !!teamId && !!auth,
    select: (data) => {
      // default folder first
      const sorted = data.folders.reduce((prev: Folder[], curr: Folder) => {
        curr.isDefault ? prev.unshift(curr) : prev.push(curr);
        return prev;
      }, []);
      return sorted;
    },
  });

  return { folders: data || [], isGetFoldersLoading: isLoading, getFoldersError: error };
};

export const useGetFolderPermissionsQuery = (folderId?: string | null) => {
  const { auth } = useAuth();

  const {
    data,
    isLoading: isGetFolderPermissionsLoading,
    error: getFolderPermissionsError,
  } = useQuery({
    queryKey: folderKeys.permissions(folderId as string),
    queryFn: () => getFolderPermissions(folderId as string),
    enabled: !!folderId && !!auth,
    select: (data) => ({
      teams: data.teams.map((item) => ({
        ...item,
        profileImageUrl: getStorageUrl(item.profileImageUrl),
        profileImageThumbnailUrl: getStorageUrl(item.profileImageThumbnailUrl),
        profileImageSmallThumbnailUrl: getStorageUrl(item.profileImageSmallThumbnailUrl),
      })),
      users: data.users.map((item) => ({
        ...item,
        name: getUserDisplayName(item),
        profileImageUrl: getStorageUrl(item.profileImageUrl),
        profileImageThumbnailUrl: getStorageUrl(item.profileImageThumbnailUrl),
        profileImageSmallThumbnailUrl: getStorageUrl(item.profileImageSmallThumbnailUrl),
      })),
      invitations: data.userInvitations,
    }),
  });

  return {
    permissions: data || { users: [], teams: [], invitations: [] },
    isGetFolderPermissionsLoading,
    getFolderPermissionsError,
  };
};

export const useCreateFolderMutation = (options: { onSuccess?: () => void } = {}) => {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();

  const { mutate: handleCreateFolder, isPending: isCreateFolderPending } = useMutation({
    mutationFn: createFolder,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: folderKeys.user() });
      setSearchParams({ folderId: data.folderId });
      toast.success('Folder has been successfully created');
      options.onSuccess && options.onSuccess();
    },
    onError: (error) => {
      toast.error(typeof error === 'string' ? error : 'An error ocurred when creating folder');
    },
  });

  return { handleCreateFolder, isCreateFolderPending };
};

export const useCreateTeamFolderMutation = (options: { onSuccess?: () => void } = {}) => {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();

  const { mutate: handleCreateTeamFolder, isPending: isCreateTeamFolderPending } = useMutation({
    mutationFn: createTeamFolder,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: folderKeys.team(variables.teamId) });
      setSearchParams({ folderId: data.folderId });
      toast.success('Folder has been successfully created');
      options.onSuccess && options.onSuccess();
    },
    onError: (error) => {
      toast.error(typeof error === 'string' ? error : 'An error ocurred when creating folder');
    },
  });

  return { handleCreateTeamFolder, isCreateTeamFolderPending };
};

export const useDeleteFolderMutation = (options: { onSuccess?: () => void } = {}) => {
  const queryClient = useQueryClient();

  const { mutate: handleDeleteFolder, isPending: isDeleteFolderPending } = useMutation({
    mutationFn: deleteFolder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: folderKeys.all });
      toast.success('Folder has been successfully deleted');
      options.onSuccess && options.onSuccess();
    },
    onError: (error) => {
      toast.error(typeof error === 'string' ? error : 'An error ocurred when deleting folder');
    },
  });

  return { handleDeleteFolder, isDeleteFolderPending };
};

export const useRenameFolderMutation = (
  options: { teamId?: string; onSuccess?: () => void } = {}
) => {
  const queryClient = useQueryClient();

  const { mutate: handleRenameFolder, isPending: isRenameFolderPending } = useMutation({
    mutationFn: renameFolder,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: options.teamId ? folderKeys.team(options.teamId) : folderKeys.user(),
      });
      toast.success('Folder has been successfully renamed');
      options.onSuccess && options.onSuccess();
    },
    onError: (error) => {
      toast.error(typeof error === 'string' ? error : 'An error ocurred when renaming folder');
    },
  });

  return { handleRenameFolder, isRenameFolderPending };
};

export const useShareFolderMutation = (
  folderId: string,
  options: { onSuccess?: () => void } = {}
) => {
  const queryClient = useQueryClient();

  const { mutate: handleShareFolder, isPending: isShareFolderPending } = useMutation({
    mutationFn: shareFolder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: folderKeys.all });
      toast.success('Folder has been successfully shared');
      options.onSuccess && options.onSuccess();
    },
    onError: (error) => {
      toast.error(typeof error === 'string' ? error : 'An error ocurred when sharing folder');
    },
  });

  return { handleShareFolder, isShareFolderPending };
};
