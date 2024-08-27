export enum AssetType {
  IMAGE = 'Image',
  VIDEO = 'Video',
  MODEL = 'Model',
  TRACE = 'Trace',
}

export type Creator = {
  email: string;
  firstName: string | null;
  lastName: string | null;
  userAlias: string | null;
  name: string;
  profileImageSmallThumbnailUrl: string | null;
};

export type Asset = {
  assetId: string;
  title: string;
  url: string;
  thumbnailUrl: string;
  fileType: AssetType;
  originalFilename: string;
  metadata: Object;
  folderId: string;
  creator: Creator;
};

export type UploadingAsset = {
  id: string;
  name: string;
  progress: number;
};
