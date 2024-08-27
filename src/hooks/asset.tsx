import { deleteAsset, getAsset, getAssets, updateAsset } from '@/api/asset';
import { getStorageUrl, getUserDisplayName } from '@/lib/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

const assetKeys = {
  all: ['assets'] as const,
  list: (folderId: string) => [...assetKeys.all, 'list', folderId] as const,
  detail: (assetId: string, folderId: string) =>
    [...assetKeys.list(folderId), 'detail', assetId] as const,
};

export const useGetAssetDetailsQuery = (
  assetId: string | undefined,
  folderId: string | undefined
) => {
  const {
    data,
    isLoading: isGetAssetDetailsLoading,
    error: getAssetDetailsError,
  } = useQuery({
    queryKey: assetKeys.detail(assetId as string, folderId as string),
    queryFn: () => getAsset(assetId as string),
    enabled: !!assetId,
    select: (data) =>
      ({
        ...data,
        metadata: data.metadata ? JSON.parse(data.metadata) : {},
        creator: {
          ...data.creator,
          name: getUserDisplayName(data.creator),
          profileImageSmallThumbnailUrl: getStorageUrl(data.creator.profileImageSmallThumbnailUrl),
        },
      }) || null,
  });

  return {
    assetDetails: data || null,
    isGetAssetDetailsLoading,
    getAssetDetailsError: getAssetDetailsError,
  };
};

export const useGetAssetsQuery = (folderId: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: assetKeys.list(folderId),
    queryFn: () => getAssets(folderId),
    enabled: !!folderId,
    select: (data) =>
      data.map((item) => ({
        ...item,
        metadata: item.metadata ? JSON.parse(item.metadata) : {},
        creator: {
          ...item.creator,
          name: getUserDisplayName(item.creator),
          profileImageSmallThumbnailUrl: getStorageUrl(item.creator.profileImageSmallThumbnailUrl),
        },
      })),
  });

  return { assets: data || [], isGetAssetsLoading: isLoading, getAssetsError: error };
};

export const useDeleteAssetMutation = (
  folderId: string,
  options: { onSuccess?: () => void } = {}
) => {
  const queryClient = useQueryClient();

  const { mutate: handleDeleteAsset, isPending: isDeleteAssetPending } = useMutation({
    mutationFn: deleteAsset,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: assetKeys.list(folderId) });
      toast.success('Asset has been successfully deleted');
      options.onSuccess && options.onSuccess();
    },
    onError: (error) => {
      toast.error(typeof error === 'string' ? error : 'An error ocurred when deleting asset');
    },
  });

  return { handleDeleteAsset, isDeleteAssetPending };
};

export const useUpdateAssetMutation = (
  folderId: string,
  options: { onSuccess?: () => void } = {}
) => {
  const queryClient = useQueryClient();

  const { mutate: handleUpdateAsset, isPending: isUpdateAssetPending } = useMutation({
    mutationFn: updateAsset,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: assetKeys.list(folderId) });
      toast.success('Asset has been successfully updated');
      options.onSuccess && options.onSuccess();
    },
    onError: (error) => {
      toast.error(typeof error === 'string' ? error : 'An error ocurred when updating asset');
    },
  });

  return { handleUpdateAsset, isUpdateAssetPending };
};
