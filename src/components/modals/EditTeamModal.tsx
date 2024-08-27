import { useState, useMemo, ChangeEvent, useEffect } from 'react';
import { ZodError, z } from 'zod';
import { TeamMember, TeamRole, TeamRoleLabel } from '@/types/Team';
import { parseCommaSeparatedEmails } from '@/lib/utils';
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
import { useAuth } from '@/hooks/useAuth';

interface Props {
  name: string;
  members: TeamMember[];
  teamId: string;
  isOpen: boolean;
  isLoading?: boolean;
  onOpenChange: () => void;
  onConfirm?: (data: {
    teamId: string;
    name: string;
    members: { email: string; permissionType: TeamRole }[];
    updatePermissions?: { userId: string; permissionType: TeamRole }[];
    revokeAccess?: string[];
  }) => void;
}

export enum ChangeStatus {
  UPDATED = 'updated',
  DELETED = 'deleted',
}

const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email({ message: 'Invalid email address' });

export default function EditTeamModal({
  isOpen,
  name,
  members,
  teamId,
  isLoading,
  onOpenChange,
  onConfirm = () => {},
}: Props) {
  const [teamName, setTeamName] = useState('');
  const [teamNameError, setTeamNameError] = useState('');
  const [selectedPermissionKeys, setSelectedPermissionKeys] = useState<Selection>(
    new Set([TeamRole.VIEWER])
  );
  const [emails, setEmails] = useState<string>('');
  const [existingMembers, setExistingMembers] = useState<TeamMember[]>([]);
  const [addedMembers, setAddedMembers] = useState<
    { email: string; fullName?: string; role: TeamRole; isDisabled: boolean }[]
  >([]);
  const [memberError, setMemberError] = useState<string>();
  const [deletedMembers, setDeletedMembers] = useState(new Map());

  const { workspace, setWorkspace } = useAuth();

  const selectedPermission = useMemo(
    () => Array.from(selectedPermissionKeys).map((key) => key as TeamRole)[0],
    [selectedPermissionKeys]
  );

  const memberPermissionsMap = useMemo(
    () => new Map(members.map((member) => [member.userId, member.permissionType])),
    [members]
  );

  const handleAddMemberChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmails(e.target.value);
  };

  const handleTeamNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTeamName(e.target.value);
  };

  const handleAddMembers = () => {
    let invalidEmails: string[] = [];
    let prevMembers = addedMembers.map((member) => ({ ...member }));
    let newMembers: { email: string; role: TeamRole; isDisabled: boolean }[] = [];

    const parsedEmails = parseCommaSeparatedEmails(emails);

    parsedEmails.forEach((email) => {
      const existingMember = existingMembers.find((member) => member.email === email);
      if (existingMember) {
        const isDeleted = deletedMembers.has(existingMember.userId);
        if (isDeleted) {
          handleRestoreMember(existingMember.userId);
        }
        if (existingMember.permissionType !== selectedPermission) {
          setExistingMembers((prevMembers) =>
            prevMembers.map((member) =>
              member.email === email ? { ...member, permissionType: selectedPermission } : member
            )
          );
        }
        return;
      }

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
    if (!teamName || !teamName.trim()) {
      setTeamNameError('Team name is required');
      return;
    }

    const newMembers = addedMembers
      .filter(
        (newMember) =>
          !existingMembers.some((existingMember) => existingMember.email === newMember.email)
      )
      .map((member) => ({ email: member.email, permissionType: member.role }));

    const updatePermissions = existingMembers
      .filter(
        (existingMember) =>
          existingMember.permissionType !== memberPermissionsMap.get(existingMember.userId)
      )
      .map((member) => ({
        userId: member.userId,
        permissionType: member.permissionType,
      }));

    const revokeAccess = Array.from(deletedMembers.keys()).filter(
      (id) => !updatePermissions.some((updatedMember) => updatedMember.userId === id)
    );

    setTeamNameError('');
    onConfirm({
      teamId,
      name: teamName,
      members: newMembers,
      ...(updatePermissions.length && { updatePermissions }),
      ...(revokeAccess.length && { revokeAccess }),
    });
  };

  useEffect(() => {
    setTeamName(name);
    setExistingMembers(members);

    return () => {
      setTeamNameError('');
      setSelectedPermissionKeys(new Set([TeamRole.VIEWER]));
      setEmails('');
      setAddedMembers([]);
      setMemberError('');
      setDeletedMembers(new Map());
    };
  }, [isOpen]);

  useEffect(() => {
    if (workspace?.id === teamId) {
      setWorkspace({ ...workspace, name });
    }
  }, [name]);

  return (
    <SplitModal
      title="Edit Team"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      imageSrc={EditTeamImagePath}
      footer={
        <PrimaryGradientButton
          text="Confirm"
          className="w-full"
          isLoading={isLoading}
          onClick={handleConfirm}
        />
      }
    >
      <p>Teams allow you to collaborate with your friends or on shared projects</p>
      <BasicInput
        label="Team Name"
        placeholder="Add name here..."
        value={teamName}
        onChange={handleTeamNameChange}
        errorMessage={teamNameError}
        isInvalid={!!teamNameError}
      />
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
                  isDisabled={isLoading}
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
          isDisabled={isLoading}
        >
          Add
        </Button>
      </div>
      <UserListWrapper>
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
              isDisabled={!member.userId}
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
