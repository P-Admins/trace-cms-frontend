import { useState, useRef, useEffect } from 'react';
import { Divider, Skeleton, useDisclosure } from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';
import { useUpdateTeamMutation, useDeleteTeamMutation } from '@/hooks/team';
import { TeamRole } from '@/types/Team';
import { useAuth } from '@/hooks/useAuth';
import BasicInput from '@/components/inputs/BasicInput';
import BasicTextarea from '@/components/inputs/BasicTextarea';
import EditButton from '@/components/buttons/EditButton';
import GrayButton from '@/components/buttons/GrayButton';
import DeleteModal from '@/components/modals/DeleteModal';
import UserAvatar from '@/components/UserAvatar';
import { myWorkspace } from '@/context/AuthProvider';

interface Props {
  teamId: string;
  teamName: string;
  teamDescription: string;
  isLoading?: boolean;
  teamProfileImgSrc?: string;
  permissionType: TeamRole | null;
}

export default function YourTeam({
  teamId,
  teamName,
  teamDescription,
  teamProfileImgSrc,
  isLoading,
  permissionType,
}: Props) {
  const { workspace, setWorkspace } = useAuth();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(teamName);
  const [description, setDescription] = useState(teamDescription);
  const [teamNameError, setTeamNameError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setName(teamName);
    setDescription(teamDescription);
    setAvatarFile(null);
  }, [teamName, teamDescription, teamId]);

  const handleEditClick = () => {
    avatarInputRef.current?.click();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files && e.target.files[0];

    setAvatarFile(uploadedFile);
  };

  const {
    isOpen: isDeleteModalOpen,
    onOpenChange: onDeleteModalOpenChange,
    onOpen: onDeleteModalOpen,
    onClose: onDeleteModalClose,
  } = useDisclosure();

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };

  const { handleUpdateTeam, isUpdateTeamPending } = useUpdateTeamMutation({
    onSuccess: () => setAvatarFile(null),
  });
  const { handleDeleteTeam, isDeleteTeamPending } = useDeleteTeamMutation({
    onSuccess: () => {
      onDeleteModalClose();
      navigate(`/settings/user`);
      if (workspace?.id === teamId) setWorkspace(myWorkspace);
    },
  });

  const onUpdate = () => {
    if (!name || !name.trim()) {
      setTeamNameError('Team name is required');
      return;
    }

    setTeamNameError('');
    handleUpdateTeam({ teamId, name, description, avatarFile });
  };

  const onDelete = () => {
    handleDeleteTeam(teamId);
  };

  useEffect(() => {
    if (workspace?.id === teamId) {
      setWorkspace({ ...workspace, name: teamName, src: teamProfileImgSrc });
    }
  }, [teamProfileImgSrc, teamName]);

  return (
    <>
      <div className="flex flex-col gap-4 pt-4 max-w-2xl">
        {isLoading ? (
          <Skeleton className="rounded-lg h-[28.8px] w-[180px] mb-4" />
        ) : (
          <h5 className="font-extrabold mb-4">{teamName}</h5>
        )}
        <div className="bg-default-100 rounded-lg p-3 flex gap-4 items-center">
          <div className="relative self-start">
            <UserAvatar
              name={teamName}
              className="h-16 w-16 text-4xl"
              radius="md"
              src={avatarFile ? URL.createObjectURL(avatarFile) : teamProfileImgSrc}
            />
            {permissionType === TeamRole.OWNER && (
              <EditButton className="absolute bottom-0 right-0" onClick={handleEditClick} />
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={avatarInputRef}
              onChange={handleFileUpload}
            />
          </div>
          <div>
            {isLoading ? (
              <>
                <Skeleton className="rounded-lg h-[21px] w-[180px]" />
                <Skeleton className="rounded-lg h-[16.8px] w-[180px] mt-1" />
              </>
            ) : (
              <>
                <p className="text-md">{teamName}</p>
                <p className="text-default-400 text-sm mt-1">{teamDescription}</p>
              </>
            )}
          </div>
        </div>
        <BasicInput
          value={name}
          onChange={handleNameChange}
          placeholder="Enter team name"
          inputWrapperClassNames="bg-default-100"
          label="Name"
          labelClassNames="text-lg"
          errorMessage={teamNameError}
          isInvalid={!!teamNameError}
          isDisabled={permissionType !== TeamRole.OWNER}
        />
        <BasicTextarea
          value={description}
          onChange={handleDescriptionChange}
          placeholder="Enter team description"
          inputWrapperClassNames="bg-default-100"
          label="Description"
          labelClassNames="text-lg"
          isDisabled={permissionType !== TeamRole.OWNER}
        />
        {permissionType === TeamRole.OWNER && (
          <>
            <div className="my-4">
              <GrayButton
                text="Update"
                className="w-[145px]"
                onClick={onUpdate}
                isLoading={isUpdateTeamPending}
              />
            </div>
            <Divider />
            <h5 className="font-extrabold my-4">Manage your team</h5>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xl">Delete Team</p>
                <p className="text-md text-default-400 mt-1">
                  Permanently delete this team and all resources within.
                </p>
              </div>
              <GrayButton text="Delete" className="w-[145px]" onClick={onDeleteModalOpen} />
            </div>
          </>
        )}
      </div>
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onOpenChange={onDeleteModalOpenChange}
        onClose={onDeleteModalClose}
        onConfirm={onDelete}
        isLoading={isDeleteTeamPending}
        title="Delete Team"
        message="Are you sure you want to permanently delete this team and all resources within?"
      />
    </>
  );
}
