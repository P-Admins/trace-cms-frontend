import { useDisclosure } from '@nextui-org/react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import { TeamRole } from '@/types/Team';
import { Folder, FolderPermission } from '@/types/Folder';
import { ApplicationRole } from '@/types/Other';
import { useAuth } from '@/hooks/useAuth';
import {
  useCreateFolderMutation,
  useRenameFolderMutation,
  useDeleteFolderMutation,
  useShareFolderMutation,
  useCreateTeamFolderMutation,
  useGetFolderPermissionsQuery,
} from '@/hooks/folder';
import CreatedFolder, { FolderActions } from '@components/folders/CreatedFolder';
import DefaultFolder from '@components/folders/DefaultFolder';
import TextButton from '@components/buttons/TextButton';
import CreateOrRenameModal from '@/components/modals/CreateOrRenameModal';
import DeleteFolderModal from '@/components/modals/DeleteModal';
import ShareFolderModal from '@/components/modals/ShareFolderModal';

type Props = {
  folders?: Folder[];
  enableAddFolderBtn?: boolean;
  isMyWorkspace?: boolean;
};

function WorkspaceFoldersList({ folders = [], enableAddFolderBtn, isMyWorkspace }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeFolderId = searchParams.get('folderId');
  const { teamId } = useParams();
  const { user } = useAuth();

  const [modal, setModal] = useState<{
    folder: { folderId?: string; title: string };
    action?: FolderActions;
  }>({ folder: { title: '' } });

  const { permissions, isGetFolderPermissionsLoading } = useGetFolderPermissionsQuery(
    modal.folder.folderId
  );

  const {
    isOpen: isCreateNewFolderOpen,
    onOpenChange: onCreateNewFolderOpenChange,
    onOpen: onCreateNewFolderOpen,
    onClose: onCreateNewFolderClose,
  } = useDisclosure();

  const {
    isOpen: isDeleteFolderOpen,
    onOpenChange: onDeleteFolderOpenChange,
    onOpen: onDeleteFolderOpen,
    onClose: onDeleteFolderClose,
  } = useDisclosure();

  const {
    isOpen: isRenameFolderOpen,
    onOpenChange: onRenameFolderOpenChange,
    onOpen: onRenameFolderOpen,
    onClose: onRenameFolderClose,
  } = useDisclosure();

  const {
    isOpen: isShareFolderModalOpen,
    onOpenChange: onShareFolderModalOpenChange,
    onOpen: onShareFolderModalOpen,
    onClose: onShareFolderModalClose,
  } = useDisclosure();

  const handleOpenFolder = (folderId: string) => {
    setSearchParams({ folderId });
  };

  const handleFolderActionClick = (
    action: FolderActions,
    folder: { folderId: string; title: string }
  ) => {
    setModal({ folder, action });
    switch (action) {
      case FolderActions.DELETE:
        onDeleteFolderOpen();
        break;
      case FolderActions.RENAME:
        onRenameFolderOpen();
        break;
      case FolderActions.SHARE:
        onShareFolderModalOpen();
        break;
    }
  };

  const { handleCreateFolder, isCreateFolderPending } = useCreateFolderMutation({
    onSuccess: () => {
      onCreateNewFolderClose();
      setModal({ folder: { title: '' } });
    },
  });

  const { handleCreateTeamFolder, isCreateTeamFolderPending } = useCreateTeamFolderMutation({
    onSuccess: () => {
      onCreateNewFolderClose();
      setModal({ folder: { title: '' } });
    },
  });

  const { handleDeleteFolder, isDeleteFolderPending } = useDeleteFolderMutation({
    onSuccess: () => {
      onDeleteFolderClose();
      setModal({ folder: { title: '' } });
      if (activeFolderId === modal.folder.folderId) {
        setSearchParams({});
      }
    },
  });

  const { handleRenameFolder, isRenameFolderPending } = useRenameFolderMutation({
    teamId,
    onSuccess: () => {
      onRenameFolderClose();
      setModal({ folder: { title: '' } });
    },
  });

  const { handleShareFolder, isShareFolderPending } = useShareFolderMutation(
    modal.folder.folderId as string,
    {
      onSuccess: () => {
        onShareFolderModalClose();
        setModal({ folder: { title: '' } });
      },
    }
  );

  const getEnableFolderActions = (folder: Folder) => {
    if (isMyWorkspace) {
      return (
        folder?.permissionType === FolderPermission.OWNER ||
        folder?.permissionType === FolderPermission.EDITOR
      );
    } else {
      return (
        (folder?.teamFolderPermissionType === FolderPermission.OWNER ||
          folder?.teamFolderPermissionType === FolderPermission.EDITOR) &&
        (folder?.userTeamPermissionType === TeamRole.OWNER ||
          folder?.userTeamPermissionType === TeamRole.EDITOR)
      );
    }
  };

  return (
    <>
      <ul className="flex flex gap-x-6 gap-y-2 flex-wrap items-center">
        {folders.map((folder) => (
          <li key={folder.folderId}>
            {folder.isDefault ? (
              <DefaultFolder
                isActive={!activeFolderId || folder.folderId === activeFolderId}
                folder={folder}
                onClick={handleOpenFolder}
              />
            ) : (
              <CreatedFolder
                isActive={folder.folderId === activeFolderId}
                folder={folder}
                onClick={handleOpenFolder}
                onFolderActionClick={handleFolderActionClick}
                enableFolderActions={getEnableFolderActions(folder)}
              />
            )}
          </li>
        ))}
        {enableAddFolderBtn && (
          <TextButton text="+ New Folder" className="text-black" onClick={onCreateNewFolderOpen} />
        )}
      </ul>
      <CreateOrRenameModal
        isOpen={isCreateNewFolderOpen}
        onOpenChange={onCreateNewFolderOpenChange}
        name={modal.folder.title}
        isLoading={teamId ? isCreateTeamFolderPending : isCreateFolderPending}
        onChange={(e) => {
          setModal({ action: FolderActions.CREATE, folder: { title: e.target.value } });
        }}
        onConfirm={() => {
          if (teamId) {
            handleCreateTeamFolder({ title: modal.folder.title, teamId });
          } else {
            handleCreateFolder({ title: modal.folder.title });
          }
        }}
        title="Create New Folder"
        label="Folder Name"
      />
      <CreateOrRenameModal
        isOpen={isRenameFolderOpen}
        onOpenChange={onRenameFolderOpenChange}
        name={modal.folder.title}
        isLoading={isRenameFolderPending}
        onChange={(e) => {
          setModal({
            action: FolderActions.RENAME,
            folder: { folderId: modal.folder.folderId, title: e.target.value },
          });
        }}
        onConfirm={() => {
          if (modal.folder.folderId) {
            handleRenameFolder({ title: modal.folder.title, folderId: modal.folder.folderId });
          }
        }}
        onClose={() => {
          setModal({ folder: { title: '' } });
          onRenameFolderClose();
        }}
        title="Rename folder"
        label="Folder Name"
      />
      <DeleteFolderModal
        isOpen={isDeleteFolderOpen}
        onOpenChange={onDeleteFolderOpenChange}
        onClose={() => {
          setModal({ folder: { title: '' } });
          onDeleteFolderClose();
        }}
        title={`Delete ${modal.folder.title}`}
        isLoading={isDeleteFolderPending}
        onConfirm={() => {
          if (modal.folder.folderId) {
            handleDeleteFolder(modal.folder.folderId);
          }
        }}
        message={`Are you sure you want to delete ${modal.folder?.title} and all of its content?`}
      />
      <ShareFolderModal
        isOpen={isShareFolderModalOpen}
        onOpenChange={onShareFolderModalOpenChange}
        folderId={modal.folder.folderId}
        users={permissions.users}
        teams={permissions.teams}
        invitedEmails={permissions.invitations}
        isSaveLoading={isShareFolderPending}
        isPermissionListLoading={isGetFolderPermissionsLoading}
        canShareWithTeams={user?.applicationRole === ApplicationRole.ADMIN}
        onConfirm={handleShareFolder}
      />
    </>
  );
}

export default WorkspaceFoldersList;
