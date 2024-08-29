import { useState, useMemo, ChangeEvent, useEffect } from 'react';
import { ZodError, z } from 'zod';
import { TeamRole, TeamRoleLabel } from '@/types/Team';
import { parseCommaSeparatedEmails } from '@/lib/utils';
import { DropdownTrigger, Button, DropdownItem, Selection } from '@nextui-org/react';
import DropdownMenuStyled from '@components/dropdown/DropdownMenuStyled';
import DropdownWrapper from '@components/dropdown/DropdownWrapper';
import { Icon } from '@iconify/react';
import SplitModal from '@/components/modals/variants/SplitModal';
import BasicInput from '@/components/inputs/BasicInput';
import PrimaryGradientButton from '@/components/buttons/PrimaryGradientButton';
import CreateTeamImage from '@/assets/CreateTeamImage.jpg';
import UserListWrapper from '@components/lists/user/UserListWrapper';
import UserItem from '@components/lists/user/UserItem';

interface Props {
  isOpen: boolean;
  currentMemberName: { email: string; fullName: string; profileImageSmallThumbnailUrl: string };
  isLoading?: boolean;
  onOpenChange: () => void;
  onConfirm?: (data: {
    name: string;
    members: { email: string; permissionType: TeamRole }[];
  }) => void;
}

const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email({ message: 'Invalid email address' });

export default function CreateTeamModal({
  isOpen,
  currentMemberName,
  isLoading,
  onOpenChange,
  onConfirm = () => {},
}: Props) {
  const initialMember = {
    email: currentMemberName.email,
    fullName: currentMemberName.fullName,
    avatar: currentMemberName.profileImageSmallThumbnailUrl,
    role: TeamRole.OWNER,
    isDisabled: true,
  };
  const [teamName, setTeamName] = useState('');
  const [teamNameError, setTeamNameError] = useState('');
  const [selectedPermissionKeys, setSelectedPermissionKeys] = useState<Selection>(
    new Set([TeamRole.EDITOR])
  );
  const [emails, setEmails] = useState<string>('');
  const [addedMembers, setAddedMembers] = useState<
    { email: string; fullName?: string; role: TeamRole; isDisabled: boolean; avatar?: string }[]
  >([initialMember]);
  const [memberError, setMemberError] = useState<string>();

  const selectedPermission = useMemo(
    () => Array.from(selectedPermissionKeys).map((key) => key as TeamRole)[0],
    [selectedPermissionKeys]
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

    setAddedMembers([...newMembers, ...prevMembers]);
    setEmails('');
    setMemberError('');
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleAddMembers();
    }
  };

  const handleRemoveMember = (email: string | number) => {
    setAddedMembers(addedMembers.filter((member) => member.email !== email));
  };

  const handleConfirm = () => {
    if (!teamName || !teamName.trim()) {
      setTeamNameError('Team name is required');
      return;
    }

    setTeamNameError('');
    onConfirm({
      name: teamName,
      members: addedMembers.map((member) => ({ email: member.email, permissionType: member.role })),
    });
  };

  useEffect(() => {
    return () => {
      setTeamName('');
      setTeamNameError('');
      setSelectedPermissionKeys(new Set([TeamRole.EDITOR]));
      setEmails('');
      setAddedMembers([initialMember]);
      setMemberError('');
    };
  }, [isOpen]);

  return (
    <SplitModal
      title="Create New Team"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      imageSrc={CreateTeamImage}
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
            <DropdownWrapper>
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
              <DropdownMenuStyled
                aria-label="Permission selection"
                selectedKeys={selectedPermissionKeys}
                selectionMode="single"
                onSelectionChange={setSelectedPermissionKeys}
                disallowEmptySelection
              >
                <DropdownItem key={TeamRole.VIEWER}>{TeamRoleLabel[TeamRole.VIEWER]}</DropdownItem>
                <DropdownItem key={TeamRole.EDITOR}>{TeamRoleLabel[TeamRole.EDITOR]}</DropdownItem>
                <DropdownItem key={TeamRole.OWNER}>{TeamRoleLabel[TeamRole.OWNER]}</DropdownItem>
              </DropdownMenuStyled>
            </DropdownWrapper>
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
              avatar: member.avatar,
            }}
            avatarSize="md"
            buttonText="Remove"
            buttonClassName="bg-primary-500"
            className="hover:bg-primary-100"
            showAvatar={true}
            onClick={handleRemoveMember}
            showBottomBorder={index !== addedMembers.length - 1}
            isDisabled={member.isDisabled}
          />
        ))}
      </UserListWrapper>
    </SplitModal>
  );
}
