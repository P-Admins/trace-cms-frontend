import { getUserProfile, updateUserProfile, deleteUser } from '@/api/user';
import { formatDateAsMonthDate, getStorageUrl, getUserDisplayName } from '@/lib/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useAuth } from './useAuth';

export const userKeys = {
  all: ['user'] as const,
  profile: () => [...userKeys.all, 'profile'] as const,
};

export const useGetUserProfileQuery = (
  options: { enabled?: boolean; retry?: boolean | number } = {}
) => {
  const { data, isLoading, isFetching } = useQuery({
    queryKey: userKeys.profile(),
    queryFn: getUserProfile,
    enabled: options.enabled,
    retry: options.retry,
    select: (data) => ({
      ...data,
      name: getUserDisplayName(data),
      profileImageSmallThumbnailUrl: getStorageUrl(data.profileImageSmallThumbnailUrl),
      profileImageThumbnailUrl: getStorageUrl(data.profileImageThumbnailUrl),
      profileImageUrl: getStorageUrl(data.profileImageUrl),
      datePasswordChanged: data.datePasswordChanged
        ? formatDateAsMonthDate(data.datePasswordChanged)
        : null,
    }),
  });

  return {
    profile: data || null,
    isGetUserProfileLoading: isLoading,
    isGetUserProfileFetching: isFetching,
  };
};

export const useUpdateUserProfileMutation = (options: { onSuccess?: () => void } = {}) => {
  const queryClient = useQueryClient();

  const {
    mutate: handleUpdateUserProfile,
    isPending: isUpdateUserProfilePending,
    status,
  } = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.profile() });
      toast.success('Your profile has been successfully updated');
      options.onSuccess && options.onSuccess();
    },
    onError: (error) => {
      toast.error(typeof error === 'string' ? error : 'An error ocurred when updating profile');
    },
  });

  return { handleUpdateUserProfile, isUpdateUserProfilePending, status };
};

export const useDeleteUserAccountMutation = (options: { onSuccess?: () => void } = {}) => {
  const { logout } = useAuth();

  const { mutate: handleDeleteUserAccount, isPending: isDeleteUserAccountPending } = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      logout();
      toast.success('Your account has been successfully deleted');
      options.onSuccess && options.onSuccess();
    },
    onError: (error) => {
      toast.error(
        typeof error === 'string' ? error : 'An error ocurred when deleting your account'
      );
    },
  });

  return { handleDeleteUserAccount, isDeleteUserAccountPending };
};
