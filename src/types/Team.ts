export enum TeamRole {
  OWNER = 'Owner',
  EDITOR = 'Editor',
  VIEWER = 'Viewer',
}

export const TeamRoleLabel: Record<TeamRole, string> = {
  [TeamRole.OWNER]: 'Owner',
  [TeamRole.VIEWER]: 'Viewer',
  [TeamRole.EDITOR]: 'Editor',
};

export type TeamMember = {
  teamId: string;
  userId: string;
  firstName: string | null;
  lastName: string | null;
  dateOfBirth: string | null;
  dateCreated: string;
  dateModified: string | null;
  profileImageSmallThumbUrl: string | null;
  isCreator: boolean;
  permissionType: TeamRole;
  email: string;
};

export type Team = {
  description: string;
  isOwner: boolean;
  name: string;
  teamId: string;
  profileImageSmallThumbnailUrl: string | null;
  profileImageThumbnailUrl: string | null;
  profileImageUrl: string | null;
  permissionType: TeamRole;
};
