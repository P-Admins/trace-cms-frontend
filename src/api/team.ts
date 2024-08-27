import { Team, TeamMember, TeamRole } from '@/types/Team';
import api from './config';
import { getErrorMessageFromResponse } from '@/lib/utils';

export const createTeam = async (params: {
  name: string;
  members: { email: string; permissionType: TeamRole }[];
}): Promise<Team> => {
  try {
    const response = await api.post('/team', params);
    return response.data;
  } catch (err: unknown) {
    console.error(err);
    const error = getErrorMessageFromResponse(err);
    throw new Error(error);
  }
};

export type UpdateTeamRequestParams = {
  teamId: string;
  name?: string;
  description?: string;
  members?: { email: string; permissionType: TeamRole }[];
  updatePermissions?: { userId: string; permissionType: TeamRole }[];
  revokeAccess?: string[];
  avatarFile?: File | null;
};

export const updateTeam = async (params: UpdateTeamRequestParams): Promise<{ ok: boolean }> => {
  try {
    const { avatarFile, ...updateParams } = params;
    await api.patch('/team/update', updateParams);

    if (avatarFile) {
      const data = new FormData();
      data.append('Image', avatarFile);
      data.append('TeamId', params.teamId);
      await api.post('/team/profile-image', data);
    }
    return { ok: true };
  } catch (err: unknown) {
    console.error(err);
    const error = getErrorMessageFromResponse(err);
    throw new Error(error);
  }
};

export const getUserTeams = async (): Promise<Team[]> => {
  try {
    const response = await api.get('/team/user-teams');
    return response.data;
  } catch (err: unknown) {
    console.error(err);
    const error = getErrorMessageFromResponse(err);
    throw new Error(error);
  }
};

export const getTeamDetails = async (id: string): Promise<Team> => {
  try {
    const response = await api.get(`/team/${id}`);
    return response.data;
  } catch (err: unknown) {
    console.error(err);
    const error = getErrorMessageFromResponse(err);
    throw new Error(error);
  }
};

export const addMembersToTeam = async (params: {
  teamId: string;
  members: { email: string; permissionType: TeamRole }[];
}): Promise<{ ok: boolean }> => {
  try {
    const response = await api.post('/team/user-teams', params);
    return { ok: true };
  } catch (err: unknown) {
    console.error(err);
    const error = getErrorMessageFromResponse(err);
    throw new Error(error);
  }
};

export const getTeamMembers = async (
  teamId: string
): Promise<{
  teamId: string;
  teamUsers: TeamMember[];
  userInvitations: { email: string; permissionType: TeamRole }[];
}> => {
  try {
    const response = await api.get(`/team/team-users/${teamId}`);
    return response.data;
  } catch (err: unknown) {
    console.error(err);
    const error = getErrorMessageFromResponse(err);
    throw new Error(error);
  }
};

export const deleteTeam = async (id: string): Promise<Team> => {
  try {
    const response = await api.delete(`/team/${id}`);
    return response.data;
  } catch (err: unknown) {
    console.error(err);
    const error = getErrorMessageFromResponse(err);
    throw new Error(error);
  }
};

export const searchByTeamName = async (filter: string): Promise<Team[]> => {
  try {
    const response = await api.get(`/team/search/${filter}`);
    return response.data;
  } catch (err: unknown) {
    console.error(err);
    const error = getErrorMessageFromResponse(err);
    throw new Error(error);
  }
};
