import { useState } from 'react';
import { useDisclosure } from '@nextui-org/react';
import { TeamMember, TeamRole } from '@/types/Team';
import { useSearchParams } from 'react-router-dom';
import {
  useGetTeamMembersQuery,
  useRemoveTeamMemberMutation,
  useUpdateTeamRoleMutation,
} from '@/hooks/team';
import InviteSection from '@/components/InviteSection';
import InviteToTeamModal from '@/components/modals/InviteToTeamModal';
import DeleteModal from '@/components/modals/DeleteModal';
import TeamTable from '@/components/tables/TeamTable';

interface Props {
  permissionType: TeamRole | null;
}

export default function TeamMembers({ permissionType }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const teamId = searchParams.get('teamId');

  const [memberToRemove, setMemberToRemove] = useState<TeamMember | null>(null);

  const { members, isGetMembersLoading } = useGetTeamMembersQuery(teamId);

  const { handleRemoveTeamMember, isRemoveTeamMemberPending } = useRemoveTeamMemberMutation({
    onSuccess: () => {
      setMemberToRemove(null);
      onDeleteMemberModalClose();
    },
  });
  const { handleUpdateTeamRole } = useUpdateTeamRoleMutation();

  const {
    isOpen: isDeleteMemberModalOpen,
    onOpenChange: onDeleteMemberModalOpenChange,
    onOpen: onDeleteMemberModalOpen,
    onClose: onDeleteMemberModalClose,
  } = useDisclosure();

  const {
    isOpen: isInviteMemberModalOpen,
    onOpenChange: onInviteMemberModalOpenChange,
    onOpen: onInviteMemberModalOpen,
    onClose: onInviteMemberModalClose,
  } = useDisclosure();

  const handleMemberRemove = (member: TeamMember) => {
    setMemberToRemove(member);
    onDeleteMemberModalOpen();
  };

  const handleDeleteMember = () => {
    if (!teamId || !memberToRemove) return;
    handleRemoveTeamMember({ teamId, revokeAccess: [memberToRemove.userId] });
  };

  const handleMemberRoleUpdate = (member: TeamMember, role: TeamRole) => {
    if (!teamId) return;
    handleUpdateTeamRole({
      teamId,
      updatePermissions: [{ userId: member.userId, permissionType: role }],
    });
  };

  return (
    <div className="pt-4">
      <h5 className="font-extrabold mb-8">Team Members ({members.length})</h5>
      {permissionType === TeamRole.OWNER && (
        <InviteSection onInviteClick={onInviteMemberModalOpen} />
      )}
      <TeamTable
        className="mt-8"
        members={members}
        isGetMembersLoading={isGetMembersLoading}
        onRemoveMember={handleMemberRemove}
        onRoleUpdate={handleMemberRoleUpdate}
        permissionType={permissionType}
      />
      <DeleteModal
        isOpen={isDeleteMemberModalOpen}
        onOpenChange={onDeleteMemberModalOpenChange}
        onClose={onDeleteMemberModalClose}
        title="Remove Team Member"
        message={`Are you sure you want to remove 
        ${memberToRemove?.firstName ? memberToRemove.firstName + memberToRemove.lastName : memberToRemove?.email} from the team?`}
        onConfirm={handleDeleteMember}
        isLoading={isRemoveTeamMemberPending}
      />
      <InviteToTeamModal
        teamId={teamId}
        members={[]}
        isOpen={isInviteMemberModalOpen}
        onClose={onInviteMemberModalClose}
        onOpenChange={onInviteMemberModalOpenChange}
      />
    </div>
  );
}
