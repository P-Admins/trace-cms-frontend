import { useState, useMemo, ChangeEvent, useEffect } from 'react';
import { ZodError, z } from 'zod';
import { TeamMember, TeamRole, TeamRoleLabel } from '@/types/Team';
import { parseCommaSeparatedEmails } from '@/lib/utils';
import { useQueryClient } from '@tanstack/react-query';
import { useAddMemberToTeamMutation } from '@/hooks/team';
import {
  Dropdown,
  DropdownTrigger,
  Button,
  DropdownMenu,
  DropdownItem,
  Selection,
} from '@nextui-org/react';
import { Icon } from '@iconify/react';
import SplitModal from '@/components/modals/variants/SplitModal';
import BasicInput from '@/components/inputs/BasicInput';
import PrimaryGradientButton from '@/components/buttons/PrimaryGradientButton';
import EditTeamImagePath from '@/assets/EditTeamImage.jpg';
import UserListWrapper from '@components/lists/user/UserListWrapper';
import UserItem from '@components/lists/user/UserItem';

interface Props {
  teamId: string | null;
  members: TeamMember[];
  isOpen: boolean;
  onClose: () => void;
  onOpenChange: () => void;
}

export enum ChangeStatus {
  UPDATED = 'updated',
  DELETED = 'deleted',
}

const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email({ message: 'Invalid email address' });

export default function InviteToTeamModal({
  isOpen,
  teamId,
  members,
  onClose,
  onOpenChange,
}: Props) {
  const queryClient = useQueryClient();

  const [selectedPermissionKeys, setSelectedPermissionKeys] = useState<Selection>(
    new Set([TeamRole.EDITOR])
  );
  const [emails, setEmails] = useState<string>('');
  const [existingMembers, setExistingMembers] = useState<(TeamMember & { isUpdated?: boolean })[]>(
    []
  );
  const [addedMembers, setAddedMembers] = useState<
    { email: string; fullName?: string; role: TeamRole; isDisabled: boolean }[]
  >([]);
  const [memberError, setMemberError] = useState<string>();
  const [deletedMembers, setDeletedMembers] = useState(new Map());

  const selectedPermission = useMemo(
    () => Array.from(selectedPermissionKeys).map((key) => key as TeamRole)[0],
    [selectedPermissionKeys]
  );

  const { handleAddMembersToTeam, isAddMembersToTeamPending } = useAddMemberToTeamMutation({
    onSuccess: onClose,
  });

  const handleAddMemberChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmails(e.target.value);
  };

  const handleAddMembers = () => {
    let invalidEmails: string[] = [];
    let prevMembers = addedMembers.map((member) => ({ ...member }));
    let newMembers: { email: string; role: TeamRole; isDisabled: boolean }[] = [];

    const parsedEmails = parseCommaSeparatedEmails(emails);

    parsedEmails.forEach((email) => {
      const duplicateMember = prevMembers.find((member) => member.email === email);
      if (duplicateMember) {
        if (!duplicateMember.isDisabled) {
          duplicateMember.role = selectedPermission;
        }
        return;
      }

      try {
        emailSchema.parse(email);
        newMembers.push({ email, role: selectedPermission, isDisabled: false });
      } catch (error) {
        if (error instanceof ZodError) {
          invalidEmails.push(email);
        }
      }
    });

    if (invalidEmails.length) {
      setMemberError(
        `Invalid ${invalidEmails.length === 1 ? 'email' : 'emails'}: ${invalidEmails.join(', ')}`
      );
      return;
    }

    setAddedMembers([...prevMembers, ...newMembers]);
    setEmails('');
    setMemberError('');
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleAddMembers();
    }
  };

  const handleRemoveNewMember = (email: string | number) => {
    setAddedMembers(addedMembers.filter((member) => member.email !== email));
  };

  const handleRestoreMember = (id: string | number) => {
    const mapCopy = new Map(deletedMembers);
    mapCopy.delete(id);
    setDeletedMembers(mapCopy);
  };

  const handleRemoveExistingMember = (id: string | number) => {
    setDeletedMembers((map) => new Map(map.set(id, true)));
  };

  const handleConfirm = () => {
    if (!teamId) return;

    handleAddMembersToTeam({
      teamId,
      members: addedMembers.map((member) => ({ email: member.email, permissionType: member.role })),
    });
  };

  useEffect(() => {
    setExistingMembers(members);

    return () => {
      setSelectedPermissionKeys(new Set([TeamRole.EDITOR]));
      setEmails('');
      setAddedMembers([]);
      setMemberError('');
      setDeletedMembers(new Map());
    };
  }, [isOpen]);

  return (
    <SplitModal
      title="Invite People"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      imageSrc={EditTeamImagePath}
      footer={
        <PrimaryGradientButton
          text="Confirm"
          className="w-full"
          isLoading={isAddMembersToTeamPending}
          onClick={handleConfirm}
        />
      }
    >
      <p>Teams allow you to collaborate with your friends or on shared projects</p>
      <div className="flex items-start gap-4">
        <BasicInput
          endContent={
            <Dropdown>
              <DropdownTrigger>
                <Button
                  className="text-default-400 text-lg"
                  endContent={
                    <span className="hidden sm:flex text-default-500">
                      <Icon icon="solar:alt-arrow-down-linear" />
                    </span>
                  }
                  size="sm"
                  variant="light"
                  isDisabled={isAddMembersToTeamPending}
                >
                  {TeamRoleLabel[selectedPermission]}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Permission selection"
                selectedKeys={selectedPermissionKeys}
                selectionMode="single"
                onSelectionChange={setSelectedPermissionKeys}
                disallowEmptySelection
              >
                <DropdownItem key={TeamRole.VIEWER}>{TeamRoleLabel[TeamRole.VIEWER]}</DropdownItem>
                <DropdownItem key={TeamRole.EDITOR}>{TeamRoleLabel[TeamRole.EDITOR]}</DropdownItem>
                <DropdownItem key={TeamRole.OWNER}>{TeamRoleLabel[TeamRole.OWNER]}</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          }
          label="Invite New Members"
          labelPlacement="outside"
          placeholder="Emails comma separated"
          value={emails}
          onChange={handleAddMemberChange}
          onKeyDown={handleKeyPress}
          errorMessage={memberError}
          isInvalid={!!memberError}
        />
        <Button
          color="primary"
          className="rounded-[5px] min-h-[50px] min-w-[129px] font-extrabold text-lg mt-[38px]"
          onClick={handleAddMembers}
          isDisabled={isAddMembersToTeamPending}
        >
          Add
        </Button>
      </div>
      <UserListWrapper className="max-h-[436px]">
        {addedMembers.map((member, index) => (
          <UserItem
            key={member.email}
            user={{
              id: member.email,
              name: member.email,
              label: member.role,
            }}
            buttonText="Remove"
            buttonClassName="bg-primary-500"
            className="hover:bg-primary-100"
            avatarSize="md"
            showAvatar={true}
            onClick={handleRemoveNewMember}
            showBottomBorder={members.length > 0 || index !== addedMembers.length - 1}
          />
        ))}
        {existingMembers.map((member, index) => {
          const isDeleted = deletedMembers.has(member.userId);
          return (
            <UserItem
              key={member.userId}
              user={{
                avatar: member.profileImageSmallThumbUrl || undefined,
                id: member.userId,
                name: member.email,
                label: member.permissionType,
              }}
              isDeleted={isDeleted}
              buttonText={isDeleted ? 'Restore' : 'Revoke'}
              buttonClassName={isDeleted ? 'bg-success-500' : 'bg-danger-500'}
              className={isDeleted ? 'hover:bg-success-50' : 'hover:bg-danger-50'}
              avatarSize="md"
              showAvatar={true}
              onClick={isDeleted ? handleRestoreMember : handleRemoveExistingMember}
              showBottomBorder={index !== members.length - 1}
            />
          );
        })}
      </UserListWrapper>
    </SplitModal>
  );
}
