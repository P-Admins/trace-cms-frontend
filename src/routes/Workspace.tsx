import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDisclosure } from '@nextui-org/react';
import { useAuth } from '@/hooks/useAuth';
import { useGetFolderPermissionsQuery, useGetFoldersQuery } from '@/hooks/folder';
import { useGetAssetsQuery } from '@/hooks/asset';
import { UploadingAsset } from '@/types/Asset';
import AssetList from '@components/lists/assets/AssetList';
import CreateNewButton from '@/components/buttons/CreateNewButton';
import FolderDescription from '@/components/workspace/FolderDescription';
import FolderTitle from '@/components/workspace/FolderTitle';
import NoContentText from '@/components/workspace/NoContentText';
import WorkspaceFoldersList from '@components/workspace/WorkspaceFoldersList';
import ImportModal from '@components/modals/ImportModal';
import FolderListSkeleton from '@components/skeletons/FolderListSkeleton';
import TextSkeleton from '@components/skeletons/TextSkeleton';
import DragAndDropFileModal from '@/components/modals/DragAndDropFileModal';
import useDragAndDropVisibility from '@/hooks/useDragAndDropVisibility';
import AssetListSkeleton from '@components/skeletons/AssetListSkeleton';
import WorkspaceTitle from '@/components/workspace/WorkspaceTitle';
import FolderShareInfo from '@/components/folders/FolderShareInfo';
import FolderPermissionsSkeleton from '@/components/skeletons/FolderPermissionsSkeleton';
import { FolderPermission } from '@/types/Folder';

export default function Workspace() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const folderId = searchParams.get('folderId');
  const [uploadingAssetsList, setUploadingAssetsList] = useState<UploadingAsset[]>([]);

  const {
    isOpen: isImportModalOpen,
    onOpenChange: onImportOpenChange,
    onOpen: onImportOpen,
    onClose: onImportClose,
  } = useDisclosure();

  const { folders, isGetFoldersLoading } = useGetFoldersQuery();
  const defaultFolderId = folders ? folders[0]?.folderId : '';
  const { assets, isGetAssetsLoading, getAssetsError } = useGetAssetsQuery(
    folderId || defaultFolderId
  );
  const { permissions, isGetFolderPermissionsLoading } = useGetFolderPermissionsQuery(folderId);

  const activeFolder = folderId ? folders.find((f) => f.folderId === folderId) : folders[0];

  const enableFolderActions =
    activeFolder?.permissionType === FolderPermission.OWNER ||
    activeFolder?.permissionType === FolderPermission.EDITOR;

  const { isDragAndDropOpen, onDragAndDropOpenChange, onDragAndDropClose } =
    useDragAndDropVisibility({ preventOpen: !enableFolderActions, beforeOpen: onImportClose });

  const handleUploadStart = (id: string, name: string) => {
    setUploadingAssetsList((prev) => [...prev, { id, name, progress: 0 }]);
  };

  const handleUploadProgress = (id: string, progress: number) => {
    setUploadingAssetsList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, progress } : item))
    );
  };

  const handleUploadComplete = (id: string) => {
    setUploadingAssetsList((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="grow flex flex-col ml-12 mr-4 my-5">
      <WorkspaceTitle text="My Workspace" className="mt-14" />
      {isGetFoldersLoading ? (
        <TextSkeleton />
      ) : (
        <div className="flex gap-3 items-end my-5">
          <FolderTitle text={activeFolder?.title || 'Untitled folder'} />
          {activeFolder && defaultFolderId === folderId ? (
            <FolderDescription text="Private to you" />
          ) : isGetFolderPermissionsLoading ? (
            <FolderPermissionsSkeleton />
          ) : (
            <FolderShareInfo
              currentUserId={user?.userId}
              users={permissions.users}
              teams={permissions.teams}
            />
          )}
        </div>
      )}
      {isGetFoldersLoading ? (
        <FolderListSkeleton />
      ) : (
        <WorkspaceFoldersList folders={folders} enableAddFolderBtn isMyWorkspace />
      )}
      {isGetAssetsLoading ? (
        <AssetListSkeleton className="mt-10" />
      ) : assets.length > 0 || uploadingAssetsList.length > 0 ? (
        <AssetList
          className="mt-10"
          list={assets}
          folderList={folders.filter((f) => f.folderId !== folderId)}
          folderId={activeFolder?.folderId}
          uploadingAssetsList={uploadingAssetsList}
          onCreateNewAssetClick={onImportOpen}
          enableFolderActions={enableFolderActions}
        />
      ) : !!folderId && !!getAssetsError ? (
        <div className="mt-10">Not found</div>
      ) : (
        <div className="grow flex flex-col items-center mt-10">
          {enableFolderActions && <CreateNewButton onClick={onImportOpen} />}
          <NoContentText
            className="text-center mb-6 mt-12"
            subText={
              enableFolderActions
                ? 'Add any content here to use it in AR within the Trace App'
                : 'This folder has no content yet'
            }
          />
        </div>
      )}
      <ImportModal
        isOpen={isImportModalOpen}
        onClose={onImportClose}
        onOpenChange={onImportOpenChange}
        folderId={folderId || defaultFolderId}
        onUploadStart={handleUploadStart}
        onUploadProgress={handleUploadProgress}
        onUploadComplete={handleUploadComplete}
      />
      <DragAndDropFileModal
        isOpen={isDragAndDropOpen}
        onOpenChange={onDragAndDropOpenChange}
        onClose={onDragAndDropClose}
        folderName={activeFolder?.title || ''}
        folderId={activeFolder?.folderId}
        onUploadStart={handleUploadStart}
        onUploadProgress={handleUploadProgress}
        onUploadComplete={handleUploadComplete}
      />
    </div>
  );
}
