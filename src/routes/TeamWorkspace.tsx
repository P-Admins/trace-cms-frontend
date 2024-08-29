import { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useDisclosure } from '@nextui-org/react';
import { useGetFolderPermissionsQuery, useGetTeamFoldersQuery } from '@/hooks/folder';
import { useGetAssetsQuery } from '@/hooks/asset';
import { useGetTeamDetailsQuery, useGetTeamMembersQuery } from '@/hooks/team';
import { UploadingAsset } from '@/types/Asset';
import AssetList from '@components/lists/assets/AssetList';
import CreateNewButton from '@/components/buttons/CreateNewButton';
import FolderTitle from '@/components/workspace/FolderTitle';
import NoContentText from '@/components/workspace/NoContentText';
import WorkspaceFoldersList from '@components/workspace/WorkspaceFoldersList';
import ImportModal from '@components/modals/ImportModal';
import FolderListSkeleton from '@components/skeletons/FolderListSkeleton';
import TextSkeleton from '@components/skeletons/TextSkeleton';
import DragAndDropFileModal from '@/components/modals/DragAndDropFileModal';
import useDragAndDropVisibility from '@/hooks/useDragAndDropVisibility';
import AssetListSkeleton from '@components/skeletons/AssetListSkeleton';
import WorkspaceHeader from '@/components/workspace/WorkspaceHeader';
import FolderShareInfo from '@/components/folders/FolderShareInfo';
import FolderPermissionsSkeleton from '@/components/skeletons/FolderPermissionsSkeleton';
import { TeamRole } from '@/types/Team';
import { FolderPermission } from '@/types/Folder';

export default function TeamWorkspace() {
  const [searchParams, setSearchParams] = useSearchParams();
  const folderId = searchParams.get('folderId');
  const { teamId } = useParams();
  const [uploadingAssetsList, setUploadingAssetsList] = useState<UploadingAsset[]>([]);

  const {
    isOpen: isImportModalOpen,
    onOpenChange: onImportOpenChange,
    onOpen: onImportOpen,
    onClose: onImportClose,
  } = useDisclosure();

  const { folders, isGetFoldersLoading } = useGetTeamFoldersQuery(teamId);

  const activeFolder = folderId ? folders.find((f) => f.folderId === folderId) : folders[0];

  const enableFolderActions =
    (activeFolder?.teamFolderPermissionType === FolderPermission.OWNER ||
      activeFolder?.teamFolderPermissionType === FolderPermission.EDITOR) &&
    (activeFolder?.userTeamPermissionType === TeamRole.OWNER ||
      activeFolder?.userTeamPermissionType === TeamRole.EDITOR);

  const { assets, isGetAssetsLoading, getAssetsError } = useGetAssetsQuery(
    activeFolder?.folderId || ''
  );
  const { permissions, isGetFolderPermissionsLoading } = useGetFolderPermissionsQuery(
    activeFolder?.folderId
  );

  const { team, isGetTeamDetailsLoading } = useGetTeamDetailsQuery(teamId || null);

  const { members } = useGetTeamMembersQuery(teamId || null);

  const { isDragAndDropOpen, onDragAndDropOpenChange, onDragAndDropClose } =
    useDragAndDropVisibility({
      preventOpen: !enableFolderActions,
      beforeOpen: onImportClose,
    });

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
    <div className="grow flex flex-col mx-12 my-5">
      <WorkspaceHeader
        className="mt-14"
        title={team?.name}
        teamId={teamId || ''}
        members={members}
        isLoading={isGetTeamDetailsLoading}
        showOptions={team?.permissionType === TeamRole.OWNER}
      />
      {isGetFoldersLoading ? (
        <TextSkeleton />
      ) : (
        <div className="flex gap-3 items-end my-5">
          <FolderTitle text={activeFolder?.title || 'Untitled Folder'} />
          {isGetFolderPermissionsLoading ? (
            <FolderPermissionsSkeleton />
          ) : (
            <FolderShareInfo
              currentTeamId={teamId}
              users={permissions.users}
              teams={permissions.teams}
            />
          )}
        </div>
      )}
      {isGetFoldersLoading ? (
        <FolderListSkeleton />
      ) : (
        <WorkspaceFoldersList
          folders={folders}
          enableAddFolderBtn={
            team?.permissionType === TeamRole.OWNER || team?.permissionType === TeamRole.EDITOR
          }
        />
      )}
      {isGetAssetsLoading ? (
        <AssetListSkeleton className="mt-10" />
      ) : assets.length > 0 || uploadingAssetsList.length > 0 ? (
        <AssetList
          className="mt-10"
          list={assets}
          folderList={folders.filter((f: any) => f.folderId !== folderId)}
          folderId={activeFolder?.folderId}
          uploadingAssetsList={uploadingAssetsList}
          onCreateNewAssetClick={onImportOpen}
          enableFolderActions={enableFolderActions}
        />
      ) : !!folderId && !!getAssetsError ? (
        <div className="mt-10">Not found</div>
      ) : activeFolder ? (
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
      ) : (
        <NoContentText
          className="text-center mb-6 mt-12"
          subText={
            enableFolderActions ? 'Create a folder and start uploading content' : 'No content yet'
          }
        />
      )}
      <ImportModal
        isOpen={isImportModalOpen}
        onClose={onImportClose}
        onOpenChange={onImportOpenChange}
        folderId={activeFolder?.folderId}
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
