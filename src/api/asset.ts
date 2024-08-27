import { AxiosProgressEvent } from 'axios';
import api from './config';
import { getErrorMessageFromResponse } from '@/lib/utils';
import { Asset, AssetType } from '@/types/Asset';

export type GetAssetResponse = {
  assetId: string;
  title: string;
  url: string;
  thumbnailUrl: string;
  fileType: AssetType;
  originalFilename: string;
  metadata: string | null;
  folderId: string;
  creator: {
    email: string;
    firstName: string | null;
    lastName: string | null;
    userAlias: string | null;
    profileImageSmallThumbnailUrl: string | null;
  };
};
export const getAsset = async (assetId: string): Promise<GetAssetResponse> => {
  try {
    const response = await api.get(`/asset/${assetId}`);
    return response.data;
  } catch (err: unknown) {
    const error = getErrorMessageFromResponse(err);
    console.error(error);
    return Promise.reject(error);
  }
};
export const uploadImage = async (
  data: FormData,
  onUploadProgress: (progressEvent: AxiosProgressEvent) => void
) => {
  try {
    const response = await api.post('/asset/image', data, { onUploadProgress });
    return response.data;
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

export const uploadVideo = async (
  data: FormData,
  onUploadProgress: (progressEvent: AxiosProgressEvent) => void
) => {
  try {
    const response = await api.post('/asset/video', data, { onUploadProgress });
    return response.data;
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

export const uploadModel = async (
  data: FormData,
  onUploadProgress: (progressEvent: AxiosProgressEvent) => void
) => {
  try {
    const response = await api.post('/asset/model', data, { onUploadProgress });
    return response.data;
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

export const uploadTraceFile = async (
  data: FormData,
  onUploadProgress: (progressEvent: AxiosProgressEvent) => void
) => {
  try {
    const response = await api.post('/asset/trace', data, { onUploadProgress });
    return response.data;
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

export const getAssets = async (folderId: string): Promise<GetAssetResponse[]> => {
  try {
    const response = await api.get(`/asset/folder/${folderId}`);
    return response.data;
  } catch (err: unknown) {
    const error = getErrorMessageFromResponse(err);
    console.error(error);
    return Promise.reject(error);
  }
};

export const deleteAsset = async (assetId: string): Promise<Asset[]> => {
  try {
    const response = await api.delete(`/asset/${assetId}`);
    return response.data;
  } catch (err: unknown) {
    console.error(err);
    const error = getErrorMessageFromResponse(err);
    throw new Error(error);
  }
};

export const updateAsset = async (params: {
  assetId: string;
  title?: string;
  folderId?: string;
  metadata?: Object | null;
}): Promise<Asset[]> => {
  try {
    const response = await api.patch(`/asset`, params);
    return response.data;
  } catch (err: unknown) {
    console.error(err);
    const error = getErrorMessageFromResponse(err);
    throw new Error(error);
  }
};
