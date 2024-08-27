import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { FolderPermission } from '@/types/Folder';
import { ShareFolderRequestParams } from '@/api/folder';
import { getStorageUrl, parseCommaSeparatedEmails } from '@/lib/utils';
import { ZodError, z } from 'zod';
import { Icon } from '@iconify/react';
import { Team } from '@/types/Team';
import { useDebounce } from '@/hooks/useDebounce';
import { useSearchByTeamNameQuery } from '@/hooks/team';
import { Button, Selection, Skeleton, Tabs, Tab } from '@nextui-org/react';
import BasicModal from '@components/modals/variants/BasicModal';
import BasicInput from '@components/inputs/BasicInput';
import PrimaryGradientButton from '@components/buttons/PrimaryGradientButton';
import UserListWrapper from '@components/lists/user/UserListWrapper';
import UserItem from '@components/lists/user/UserItem';
import DropdownList from '@components/lists/DropdownList';
import SmallAvatar from '@components/avatars/SmallAvatar';
import PermissionDropdown from '@/components/dropdown/PermissionDropdown';

type ExistingUser = {
  email: string;
  userId: string;
  name: string;
  permissionType: FolderPermission | null;
  profileImageSmallThumbnailUrl: string;
};

type ExistingTeam = {
  teamId: string;
  name: string;
  permissionType: FolderPermission | null;
  profileImageSmallThumbnailUrl: string;
};

interface Props {
  isOpen: boolean;
  isSaveLoading?: boolean;
  isPermissionListLoading?: boolean;
  folderId?: string;
  canShareWithTeams?: boolean;
  users?: ExistingUser[];
  teams?: ExistingTeam[];
  invitedEmails?: {
    email: string;
    permissionType: FolderPermission;
  }[];
  onOpenChange: () => void;
  onConfirm?: (params: ShareFolderRequestParams) => void;
}

const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email({ message: 'Invalid email address' });

export default function ShareFolderModal({
  isOpen,
  onOpenChange,
  folderId,
  isSaveLoading,
  isPermissionListLoading,
  users = [],
  teams = [],
  invitedEmails = [],
  onConfirm = () => {},
  canShareWithTeams,
}: Props) {
  const [selectedMemberType, setSelectedMemberType] = useState<string | null | number>('email');
  const [selectedPermissionKeys, setSelectedPermissionKeys] = useState<Selection>(
    new Set([FolderPermission.VIEWER])
  );
  const [selectedTeamPermissionKeys, setSelectedTeamPermissionKeys] = useState<Selection>(
    new Set([FolderPermission.VIEWER])
  );
  const [emails, setEmails] = useState<string>('');
  const [addedEmails, setAddedEmails] = useState<{ email: string; role: FolderPermission }[]>([]);
  const [emailError, setEmailError] = useState<string>();
  const [deletedUsers, setDeletedUsers] = useState(new Map());
  const [existingUsers, setExistingUsers] = useState<ExistingUser[]>([]);
  const [existingTeams, setExistingTeams] = useState<ExistingTeam[]>([]);
  const [teamsInput, setTeamsInput] = useState('');
  const [selectedTeamsInput, setSelectedTeamsInput] = useState<Team[]>([]);
  const [selectedTeamsInputMap, setSelectedTeamsInputMap] = useState<Map<string, Team>>(new Map());
  const [addedTeams, setAddedTeams] = useState<(Team & { role: FolderPermission })[]>([]);
  const [deletedTeams, setDeletedTeams] = useState(new Map());
  const debouncedTeamSearch = useDebounce(teamsInput);
  const teamsWithFolderPermissions = new Map();
  [...teams, ...addedTeams].forEach((item) => {
    teamsWithFolderPermissions.set(item.teamId, true);
  });

  const selectedPermission = useMemo(
    () => Array.from(selectedPermissionKeys).map((key) => key as FolderPermission)[0],
    [selectedPermissionKeys]
  );
  const selectedTeamPermission = useMemo(
    () => Array.from(selectedTeamPermissionKeys).map((key) => key as FolderPermission)[0],
    [selectedTeamPermissionKeys]
  );

  const userPermissionsMap = useMemo(
    () => new Map(users.map((user) => [user.userId, user.permissionType])),
    [users]
  );
  const teamPermissionsMap = useMemo(
    () => new Map(teams.map((team) => [team.teamId, team.permissionType])),
    [teams]
  );

  const { searchedTeams, isSearchByTeamNameLoading } =
    useSearchByTeamNameQuery(debouncedTeamSearch);

  const handleAddEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmails(e.target.value);
  };

  const handleAddTeamChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTeamsInput(e.target.value);
  };

  const handleSelectTeam = (team: Team) => {
    const isTeamAlreadySelected = selectedTeamsInputMap.has(team.teamId);
    if (isTeamAlreadySelected) return;

    setSelectedTeamsInput([...selectedTeamsInput, team]);
    setSelectedTeamsInputMap((map) => new Map(map.set(team.teamId, team)));
    setTeamsInput('');
  };

  const handleAddTeams = () => {
    let newTeams: (Team & { role: FolderPermission })[] = [];
    let prevTeams = addedTeams.map((team) => ({ ...team }));

    selectedTeamsInput.forEach((team) => {
      const existingTeam = existingTeams.find((existing) => existing.teamId === team.teamId);

      if (existingTeam) {
        const isDeleted = deletedTeams.has(existingTeam.teamId);
        if (isDeleted) {
          handleRestoreTeam(existingTeam.teamId);
        }
        if (existingTeam.permissionType !== selectedTeamPermission) {
          setExistingTeams((prevTeams) =>
            prevTeams.map((existing) =>
              existing.teamId === team.teamId
                ? { ...existing, permissionType: selectedTeamPermission }
                : existing
            )
          );
        }
        return;
      }

      const duplicateTeam = prevTeams.find((prev) => prev.teamId === team.teamId);
      if (duplicateTeam) {
        duplicateTeam.role = selectedTeamPermission;
        return;
      }

      newTeams.push({ ...team, role: selectedTeamPermission });
    });

    setAddedTeams([...newTeams, ...prevTeams]);
    setSelectedTeamsInput([]);
    setSelectedTeamsInputMap(new Map());
  };

  const handleRemoveTeamFromInput = (teamId: string) => {
    setSelectedTeamsInput(selectedTeamsInput.filter((team) => team.teamId !== teamId));
    const mapCopy = new Map(selectedTeamsInputMap);
    mapCopy.delete(teamId);
    setSelectedTeamsInputMap(mapCopy);
  };

  const handleRemoveAddedTeam = (teamId: string | number) => {
    setAddedTeams(addedTeams.filter((item) => item.teamId !== teamId));
  };

  const handleRemoveExistingTeam = (id: string | number) => {
    setDeletedTeams((map) => new Map(map.set(id, true)));
  };

  const handleAddEmails = () => {
    let invalidEmails: string[] = [];
    let prevMembers = addedEmails.map((member) => ({ ...member }));
    let newMembers: { email: string; role: FolderPermission }[] = [];

    const parsedEmails = parseCommaSeparatedEmails(emails);

    parsedEmails.forEach((email) => {
      const existingUser = existingUsers.find((user) => user.email === email);
      if (existingUser) {
        const isDeleted = deletedUsers.has(existingUser.userId);
        if (isDeleted) {
          handleRestoreUser(existingUser.userId);
        }
        if (existingUser.permissionType !== selectedPermission) {
          setExistingUsers((prevUsers) =>
            prevUsers.map((user) =>
              user.email === email ? { ...user, permissionType: selectedPermission } : user
            )
          );
        }
        return;
      }

      const duplicateMember = prevMembers.find((member) => member.email === email);
      if (duplicateMember) {
        duplicateMember.role = selectedPermission;
        return;
      }

      try {
        emailSchema.parse(email);
        newMembers.push({ email, role: selectedPermission });
      } catch (error) {
        if (error instanceof ZodError) {
          invalidEmails.push(email);
        }
      }
    });

    if (invalidEmails.length) {
      setEmailError(
        `Invalid ${invalidEmails.length === 1 ? 'email' : 'emails'}: ${invalidEmails.join(', ')}`
      );
      return;
    }

    setAddedEmails([...newMembers, ...prevMembers]);
    setEmails('');
    setEmailError('');
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      selectedMemberType === 'email' ? handleAddEmails() : handleAddTeams();
    }
  };

  const handleRemoveNewEmail = (email: string | number) => {
    setAddedEmails(addedEmails.filter((item) => item.email !== email));
  };

  const handleRemoveExistingUser = (id: string | number) => {
    setDeletedUsers((map) => new Map(map.set(id, true)));
  };

  const handleRestoreUser = (id: string | number) => {
    const mapCopy = new Map(deletedUsers);
    mapCopy.delete(id);
    setDeletedUsers(mapCopy);
  };

  const handleRestoreTeam = (id: string | number) => {
    const mapCopy = new Map(deletedTeams);
    mapCopy.delete(id);
    setDeletedTeams(mapCopy);
  };

  const handleConfirm = () => {
    if (!folderId) return;

    const newUsers = addedEmails
      .filter((newUser) => !users.some((user) => user.email === newUser.email))
      .map((user) => ({ email: user.email, permissionType: user.role }));

    const updateUserPermissions = existingUsers
      .filter(
        (existingUser) =>
          existingUser.permissionType !== userPermissionsMap.get(existingUser.userId)
      )
      .map((user) => ({
        userId: user.userId,
        permissionType: user.permissionType || '',
      }));

    const revokeUserAccess = Array.from(deletedUsers.keys()).filter(
      (id) => !updateUserPermissions.some((updateUser) => updateUser.userId === id)
    );

    const newTeams = addedTeams
      .filter((newTeam) => !teamPermissionsMap.has(newTeam.teamId))
      .map((team) => ({ teamId: team.teamId, permissionType: team.role }));

    const updateTeamPermissions = existingTeams
      .filter(
        (existingTeam) =>
          existingTeam.permissionType !== teamPermissionsMap.get(existingTeam.teamId)
      )
      .map((team) => ({
        teamId: team.teamId,
        permissionType: team.permissionType || '',
      }));

    const revokeTeamAccess = Array.from(deletedTeams.keys()).filter(
      (id) => !updateTeamPermissions.some((updateTeam) => updateTeam.teamId === id)
    );

    onConfirm({
      people: {
        folderId,
        members: newUsers,
        updatePermissions: updateUserPermissions,
        revokeAccess: revokeUserAccess,
      },
      teams: {
        folderId,
        teams: newTeams,
        updatePermissions: updateTeamPermissions,
        revokeAccess: revokeTeamAccess,
      },
    });
  };

  const addPeopleByEmail = (
    <div className="flex items-start gap-4">
      <BasicInput
        endContent={
          <PermissionDropdown
            selectedPermissionKeys={selectedPermissionKeys}
            setSelectedPermissionKeys={setSelectedPermissionKeys}
            isDisabled={isSaveLoading}
          />
        }
        label="Invite New Members"
        labelPlacement="outside"
        placeholder="Emails comma separated"
        value={emails}
        onChange={handleAddEmailChange}
        onKeyDown={handleKeyPress}
        errorMessage={emailError}
        isInvalid={!!emailError}
      />
      <Button
        color="primary"
        className="rounded-[5px] min-h-[50px] min-w-[129px] font-extrabold text-lg mt-[38px]"
        onClick={handleAddEmails}
        isDisabled={isSaveLoading}
      >
        Add
      </Button>
    </div>
  );

  useEffect(() => {
    if (isOpen && !isPermissionListLoading) {
      setExistingUsers(users);
      setExistingTeams(teams);
    }
  }, [isOpen, isPermissionListLoading]);

  useEffect(() => {
    return () => {
      setSelectedPermissionKeys(new Set([FolderPermission.VIEWER]));
      setSelectedTeamPermissionKeys(new Set([FolderPermission.VIEWER]));
      setEmails('');
      setAddedEmails([]);
      setEmailError('');
      setDeletedUsers(new Map());
      setTeamsInput('');
      setSelectedTeamsInput([]);
      setSelectedTeamsInputMap(new Map());
      setAddedTeams([]);
      setDeletedTeams(new Map());
    };
  }, [isOpen]);

  return (
    <BasicModal
      className="max-w-[700px]"
      classNames={{
        body: ['text-left', 'min-h-[250px]'],
        header: ['justify-center'],
      }}
      title="Share Folder"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      footer={
        <PrimaryGradientButton
          text="Confirm"
          className="w-full"
          isLoading={isSaveLoading}
          onClick={handleConfirm}
        />
      }
    >
      {canShareWithTeams ? (
        <Tabs
          size="md"
          aria-label="Tabs form"
          color="primary"
          variant="underlined"
          selectedKey={selectedMemberType}
          onSelectionChange={setSelectedMemberType}
        >
          <Tab key="email" title="Share with people">
            {addPeopleByEmail}
          </Tab>
          <Tab key="team" title="Share with teams">
            <div className="relative w-full">
              <div className="flex items-start gap-4">
                <BasicInput
                  endContent={
                    <Icon
                      icon={isSearchByTeamNameLoading ? 'eos-icons:loading' : 'iconamoon:search'}
                      className="text-default-400 text-lg"
                    />
                  }
                  inputWrapperClassNames="h-fit"
                  label="Invite New Members"
                  labelPlacement="outside"
                  placeholder="Search teams"
                  value={teamsInput}
                  onChange={handleAddTeamChange}
                  onKeyDown={handleKeyPress}
                />
              </div>
              {searchedTeams.length > 0 && teamsInput.length > 0 && (
                <DropdownList
                  className="mt-2 absolute w-full z-20 max-h-[200px] overflow-y-auto"
                  list={searchedTeams.map((item) => ({
                    value: item.teamId,
                    text: item.name,
                    icon: selectedTeamsInputMap.has(item.teamId)
                      ? 'iconamoon:check-fill'
                      : undefined,
                    onClick: () => handleSelectTeam(item),
                    avatar: getStorageUrl(item.profileImageSmallThumbnailUrl),
                  }))}
                />
              )}
            </div>
            {selectedTeamsInput.length > 0 && (
              <div className="flex gap-2 items-start mt-4">
                <div className="flex grow bg-content1 rounded-[5px] min-h-[50px] p-2 ">
                  <ul className="flex flex-wrap gap-1 grow">
                    {selectedTeamsInput.map((item) => (
                      <li
                        className="bg-primary-100 py-1 px-2 rounded-[14px] flex items-center gap-1 cursor-pointer"
                        key={item.teamId}
                      >
                        <SmallAvatar
                          name={item.name}
                          className="w-5 h-5"
                          src={getStorageUrl(item.profileImageSmallThumbnailUrl)}
                        />
                        <span className="grow whitespace-nowrap text-sm">{item.name}</span>
                        <Icon
                          icon="iconamoon:close-fill"
                          onClick={() => handleRemoveTeamFromInput(item.teamId)}
                        />
                      </li>
                    ))}
                  </ul>
                  <PermissionDropdown
                    selectedPermissionKeys={selectedTeamPermissionKeys}
                    setSelectedPermissionKeys={setSelectedTeamPermissionKeys}
                    isDisabled={isSaveLoading}
                  />
                </div>
                <Button
                  color="primary"
                  className="rounded-[5px] min-h-[50px] min-w-[129px] font-extrabold text-lg"
                  onClick={handleAddTeams}
                  isDisabled={isSaveLoading}
                >
                  Add
                </Button>
              </div>
            )}
          </Tab>
        </Tabs>
      ) : (
        addPeopleByEmail
      )}
      <div>
        {isPermissionListLoading ? (
          <Skeleton className="rounded-lg h-[120px] w-full mt-5"></Skeleton>
        ) : (
          <UserListWrapper className="mt-5">
            {addedEmails.map((item, index) => (
              <UserItem
                key={item.email}
                user={{
                  id: item.email,
                  name: item.email,
                  label: item.role,
                }}
                buttonText="Remove"
                buttonClassName="bg-primary-500"
                className="hover:bg-primary-100"
                avatarSize="md"
                showAvatar={true}
                onClick={handleRemoveNewEmail}
                showBottomBorder={
                  invitedEmails.length + users.length + teams.length + addedTeams.length > 0 ||
                  index !== addedEmails.length - 1
                }
              />
            ))}
            {addedTeams.map((item, index) => (
              <UserItem
                key={item.teamId}
                user={{
                  id: item.teamId,
                  name: item.name,
                  label: item.role,
                  avatar: getStorageUrl(item.profileImageSmallThumbnailUrl),
                }}
                buttonText="Remove"
                buttonClassName="bg-primary-500"
                className="hover:bg-primary-100"
                avatarSize="md"
                showAvatar={true}
                onClick={handleRemoveAddedTeam}
                showBottomBorder={
                  invitedEmails.length + users.length + teams.length > 0 ||
                  index !== addedTeams.length - 1
                }
              />
            ))}
            {invitedEmails.map((item, index) => {
              return (
                <UserItem
                  key={item.email}
                  user={{
                    id: item.email,
                    name: item.email,
                    label: '(Invited) ' + item.permissionType,
                  }}
                  avatarSize="md"
                  showAvatar={true}
                  showButton={false}
                  showBottomBorder={
                    users.length + teams.length > 0 || index !== invitedEmails.length - 1
                  }
                />
              );
            })}
            {existingUsers.map((item, index) => {
              const isDeleted = deletedUsers.has(item.userId);
              return (
                <UserItem
                  key={item.userId}
                  user={{
                    avatar: item.profileImageSmallThumbnailUrl,
                    id: item.userId,
                    name: item.name,
                    label: item.permissionType || '',
                  }}
                  isDeleted={isDeleted}
                  buttonText={isDeleted ? 'Restore' : 'Revoke'}
                  buttonClassName={isDeleted ? 'bg-success-500' : 'bg-danger-500'}
                  className={isDeleted ? 'hover:bg-success-50' : 'hover:bg-danger-50'}
                  avatarSize="md"
                  showAvatar={true}
                  onClick={isDeleted ? handleRestoreUser : handleRemoveExistingUser}
                  showBottomBorder={teams.length > 0 || index !== users.length - 1}
                />
              );
            })}
            {existingTeams.map((item, index) => {
              const isDeleted = deletedTeams.has(item.teamId);
              return (
                <UserItem
                  key={item.teamId}
                  user={{
                    avatar: item.profileImageSmallThumbnailUrl,
                    id: item.teamId,
                    name: item.name,
                    label: item.permissionType || '',
                  }}
                  isDeleted={isDeleted}
                  buttonText={isDeleted ? 'Restore' : 'Revoke'}
                  buttonClassName={isDeleted ? 'bg-success-500' : 'bg-danger-500'}
                  className={isDeleted ? 'hover:bg-success-50' : 'hover:bg-danger-50'}
                  avatarSize="md"
                  showAvatar={true}
                  onClick={isDeleted ? handleRestoreTeam : handleRemoveExistingTeam}
                  showBottomBorder={index !== teams.length - 1}
                />
              );
            })}
          </UserListWrapper>
        )}
      </div>
    </BasicModal>
  );
}
