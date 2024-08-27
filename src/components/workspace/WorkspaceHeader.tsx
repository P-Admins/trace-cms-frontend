import { useDisclosure } from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';
import { TeamMember } from '@/types/Team';
import DeleteModal from '@/components/modals/DeleteModal';
import WorkspaceTitle from '@/components/workspace/WorkspaceTitle';
import BasicDropdown from '@components/dropdown/BasicDropdown';
import PencilIcon from '@icons/Pencil.svg?react';
import TrashIcon from '@icons/Trash.svg?react';
import EditTeamModal from '@components/modals/EditTeamModal';
import TextSkeleton from '../skeletons/TextSkeleton';
import { useDeleteTeamMutation, useUpdateTeamMutation } from '@/hooks/team';

interface Props {
  title?: string;
  teamId: string;
  members: TeamMember[];
  isLoading?: boolean;
  showOptions?: boolean;
  className?: string;
}

export default function WorkspaceHeader({
  title,
  teamId,
  members,
  isLoading,
  showOptions,
  className = '',
}: Props) {
  const {
    isOpen: isCreateTeamModalOpen,
    onOpenChange: onCreateTeamModalOpenChange,
    onOpen: onCreateTeamModalOpen,
    onClose: onCreateTeamModalClose,
  } = useDisclosure();

  const {
    isOpen: isDeleteModalOpen,
    onOpenChange: onDeleteModalOpenChange,
    onOpen: onDeleteModalOpen,
    onClose: onDeleteModalClose,
  } = useDisclosure();

  const navigate = useNavigate();

  const { handleUpdateTeam, isUpdateTeamPending } = useUpdateTeamMutation({
    onSuccess: onCreateTeamModalClose,
  });
  const { handleDeleteTeam, isDeleteTeamPending } = useDeleteTeamMutation({
    onSuccess: () => {
      onDeleteModalClose();
      navigate('/my-workspace');
    },
  });

  const onDelete = () => {
    handleDeleteTeam(teamId);
  };

  return (
    <div className={`flex gap-3 items-center ${className}`}>
      {isLoading ? <TextSkeleton /> : <WorkspaceTitle text={title} />}
      {showOptions && (
        <BasicDropdown
          className="min-w-40"
          placement="bottom-start"
          dropdownItems={[
            {
              icon: <PencilIcon width={24} height={24} />,
              text: 'Edit',
              onClick: onCreateTeamModalOpen,
            },
            {
              icon: <TrashIcon width={24} height={24} />,
              text: 'Delete',
              onClick: onDeleteModalOpen,
            },
          ]}
        />
      )}
      <EditTeamModal
        name={title || ''}
        members={members}
        teamId={teamId}
        isOpen={isCreateTeamModalOpen}
        onOpenChange={onCreateTeamModalOpenChange}
        onConfirm={handleUpdateTeam}
        isLoading={isUpdateTeamPending}
      />
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onOpenChange={onDeleteModalOpenChange}
        onClose={onDeleteModalClose}
        title="Delete Team"
        message="Are you sure you want to permanently delete this team and all resources within?"
        onConfirm={onDelete}
        isLoading={isDeleteTeamPending}
      />
    </div>
  );
}
