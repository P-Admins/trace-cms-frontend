import { AvatarGroup } from '@nextui-org/react';
import { FolderPermission } from '@/types/Folder';
import { parseUserAndTeamList } from '@/lib/utils';
import { MemberType } from '@/types/Other';
import SmallAvatar from '@components/avatars/SmallAvatar';

type Props = {
  currentUserId?: string;
  currentTeamId?: string;
  users: {
    userId: string;
    name: string;
    permissionType: FolderPermission | null;
    profileImageSmallThumbnailUrl: string | null;
  }[];
  teams: {
    teamId: string;
    name: string;
    permissionType: FolderPermission | null;
    profileImageSmallThumbnailUrl: string | null;
  }[];
};

function FolderShareInfo({ currentUserId, currentTeamId, users, teams }: Props) {
  const allUsersAndTeams = users
    .map(({ userId, ...item }) => ({
      ...item,
      id: userId,
      type: MemberType.USER,
      isCurrentUserOrTeam: userId === currentUserId,
    }))
    .concat(
      teams.map(({ teamId, ...item }) => ({
        ...item,
        id: teamId,
        type: MemberType.TEAM,
        isCurrentUserOrTeam: teamId === currentTeamId,
      }))
    );

  const owners = allUsersAndTeams.filter(
    (member) => member.permissionType === FolderPermission.OWNER
  );
  owners.sort((a, b) => (a.isCurrentUserOrTeam ? -1 : 1));
  const editorsAndViewers = allUsersAndTeams.filter(
    (member) => member.permissionType !== FolderPermission.OWNER
  );
  editorsAndViewers.sort((a, b) => (a.isCurrentUserOrTeam ? -1 : 1));

  return (
    <div className="flex gap-2 items-center">
      {owners.length === 1 ? (
        <SmallAvatar
          size="sm"
          key={owners[0].id}
          name={owners[0].name}
          src={owners[0].profileImageSmallThumbnailUrl || undefined}
          showTooltip
        />
      ) : (
        <AvatarGroup
          size="sm"
          className="ml-4"
          classNames={{ count: 'bg-default-500 text-content1' }}
          max={4}
        >
          {owners.map((member) => (
            <SmallAvatar
              key={member.id}
              name={member.name}
              src={member.profileImageSmallThumbnailUrl || undefined}
              showTooltip
            />
          ))}
        </AvatarGroup>
      )}
      {owners.length > 0 && editorsAndViewers.length > 0 && (
        <div className="h-[32px] border-r border-default-400 mr-2"></div>
      )}
      <AvatarGroup size="sm" classNames={{ count: 'bg-default-500 text-content1' }} max={4}>
        {editorsAndViewers.map((member) => (
          <SmallAvatar
            key={member.id}
            name={member.name}
            src={member.profileImageSmallThumbnailUrl || undefined}
            showTooltip
          />
        ))}
      </AvatarGroup>
      <p className="text-sm text-primary-900 max-w-96 line-clamp-2">
        {owners.length > 0 && `Owned by ${parseUserAndTeamList(owners)}. `}
        {editorsAndViewers.length > 0 && `Shared with ${parseUserAndTeamList(editorsAndViewers)}.`}
      </p>
    </div>
  );
}

export default FolderShareInfo;
