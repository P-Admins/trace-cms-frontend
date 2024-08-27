import api from './config';
import { getErrorFromResponse, getErrorMessageFromResponse } from '@/lib/utils';
import { FolderPermission } from '@/types/Folder';
import { ApplicationRole } from '@/types/Other';

export type GetUserProfileResponse = {
  userId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  userAlias: string;
  dateOfBirth: string | null;
  profileImageUrl: string | null;
  profileImageThumbnailUrl: string | null;
  profileImageSmallThumbnailUrl: string | null;
  permissionType: FolderPermission | null;
  organization: string | null;
  usageType: string | null;
  receiveNewsletter: boolean;
  datePasswordChanged: string | null;
  applicationRole: ApplicationRole;
};

export const getUserProfile = async (): Promise<GetUserProfileResponse> => {
  try {
    const response = await api.get('/user/profile');
    return response.data;
  } catch (err: unknown) {
    console.error(err);
    const error = getErrorFromResponse(err);
    throw error;
  }
};

export type UpdateUserProfileRequestParams = {
  userData: {
    userId: string;
    firstName?: string;
    lastName?: string;
    middleName?: string;
    userAlias?: string;
    dateOfBirth?: string;
    userEmail?: string;
  } | null;
  profileImage: File | null;
};
export const updateUserProfile = async (
  params: UpdateUserProfileRequestParams
): Promise<{ ok: boolean }> => {
  try {
    if (params.userData) {
      await api.patch('/user', params.userData);
    }

    if (params.profileImage) {
      const data = new FormData();
      data.append('Image', params.profileImage);
      await api.post('/user/profile-image', data);
    }
    return { ok: true };
  } catch (err: unknown) {
    console.error(err);
    const error = getErrorMessageFromResponse(err);
    throw new Error(error);
  }
};

export const deleteUser = async (userId: string): Promise<{ ok: boolean }> => {
  try {
    await api.delete(`/user/${userId}`);
    return { ok: true };
  } catch (err: unknown) {
    console.error(err);
    const error = getErrorMessageFromResponse(err);
    throw new Error(error);
  }
};
