import {
  addMembersToTeam,
  createTeam,
  getTeamMembers,
  getUserTeams,
  getTeamDetails,
  updateTeam,
  deleteTeam,
  searchByTeamName,
} from '@/api/team';
import { getStorageUrl } from '@/lib/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { toast } from 'react-toastify';

export const teamKeys = {
  myTeams: ['team'] as const,
  list: () => [...teamKeys.myTeams, 'list'] as const,
  detail: (teamId: string) => [...teamKeys.list(), 'detail', teamId] as const,
  members: (teamId: string) => [...teamKeys.myTeams, 'members', teamId] as const,
  searchByNameAll: () => [...teamKeys.myTeams, 'search'] as const,
  searchByName: (filter: string) => [...teamKeys.myTeams, 'search', filter] as const,
};

export const useGetUserTeamsQuery = () => {
  const { auth } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: teamKeys.myTeams,
    queryFn: getUserTeams,
    enabled: !!auth,
    select: (data) =>
      data.map((team) => ({
        ...team,
        profileImageUrl: getStorageUrl(team.profileImageUrl),
        profileImageSmallThumbnailUrl: getStorageUrl(team.profileImageSmallThumbnailUrl),
        profileImageThumbnailUrl: getStorageUrl(team.profileImageThumbnailUrl),
      })),
  });

  return { teams: data || [], isGetTeamsLoading: isLoading };
};

export const useGetTeamDetailsQuery = (teamId: string | null) => {
  const { auth } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: teamKeys.detail(teamId as string),
    queryFn: () => getTeamDetails(teamId as string),
    enabled: !!teamId && !!auth,
    select: (data) => ({
      ...data,
      profileImageUrl: getStorageUrl(data.profileImageUrl),
      profileImageThumbnailUrl: getStorageUrl(data.profileImageThumbnailUrl),
      profileImageSmallThumbnailUrl: getStorageUrl(data.profileImageSmallThumbnailUrl),
    }),
  });

  return { team: data, isGetTeamDetailsLoading: isLoading };
};

export const useGetTeamMembersQuery = (teamId: string | null) => {
  const { auth } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: teamKeys.members(teamId as string),
    queryFn: () => getTeamMembers(teamId as string),
    enabled: !!teamId && !!auth,
    select: (data) => {
      const members = [
        ...data.teamUsers.map((member) => ({
          ...member,
          profileImageSmallThumbUrl: member.profileImageSmallThumbUrl
            ? getStorageUrl(member.profileImageSmallThumbUrl)
            : null,
        })),
        ...data.userInvitations.map((invitation) => ({
          teamId: data.teamId,
          userId: '',
          firstName: null,
          lastName: null,
          dateOfBirth: null,
          dateCreated: '',
          dateModified: null,
          profileImageSmallThumbUrl: null,
          isCreator: false,
          permissionType: invitation.permissionType,
          email: invitation.email,
        })),
      ];

      return members;
    },
  });

  return {
    members: data || [],
    isGetMembersLoading: isLoading,
    getMembersError: error,
  };
};

export const useCreateTeamMutation = (options: { onSuccess?: () => void } = {}) => {
  const queryClient = useQueryClient();

  const { mutate: handleCreateTeam, isPending: isCreateTeamPending } = useMutation({
    mutationFn: createTeam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamKeys.myTeams });
      toast.success('Team has been successfully created');
      options.onSuccess && options.onSuccess();
    },
    onError: (error) => {
      toast.error(typeof error === 'string' ? error : 'An error ocurred when creating team');
    },
  });

  return { handleCreateTeam, isCreateTeamPending };
};

export const useUpdateTeamMutation = (options: { onSuccess?: () => void } = {}) => {
  const queryClient = useQueryClient();

  const { mutate: handleUpdateTeam, isPending: isUpdateTeamPending } = useMutation({
    mutationFn: updateTeam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamKeys.myTeams });
      toast.success('Team has been successfully updated');
      options.onSuccess && options.onSuccess();
    },
    onError: (error) => {
      toast.error(typeof error === 'string' ? error : 'An error ocurred when updating team');
    },
  });

  return { handleUpdateTeam, isUpdateTeamPending };
};

export const useRemoveTeamMemberMutation = (options: { onSuccess?: () => void } = {}) => {
  const queryClient = useQueryClient();

  const { mutate: handleRemoveTeamMember, isPending: isRemoveTeamMemberPending } = useMutation({
    mutationFn: updateTeam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamKeys.myTeams });
      toast.success('Member has been successfully removed from the team');
      options.onSuccess && options.onSuccess();
    },
    onError: (error) => {
      toast.error(typeof error === 'string' ? error : 'An error ocurred when removing team member');
    },
  });

  return { handleRemoveTeamMember, isRemoveTeamMemberPending };
};

export const useUpdateTeamRoleMutation = (options: { onSuccess?: () => void } = {}) => {
  const queryClient = useQueryClient();

  const { mutate: handleUpdateTeamRole, isPending: isUpdateTeamRolePending } = useMutation({
    mutationFn: updateTeam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamKeys.myTeams });
      toast.success('Member role has been successfully updated');
      options.onSuccess && options.onSuccess();
    },
    onError: (error) => {
      toast.error(typeof error === 'string' ? error : 'An error ocurred when updating team role');
    },
  });

  return { handleUpdateTeamRole, isUpdateTeamRolePending };
};

export const useAddMemberToTeamMutation = (options: { onSuccess?: () => void } = {}) => {
  const queryClient = useQueryClient();

  const { mutate: handleAddMembersToTeam, isPending: isAddMembersToTeamPending } = useMutation({
    mutationFn: addMembersToTeam,
    onSuccess: (data, params) => {
      console.log('Add member to team:', data, params);
      queryClient.invalidateQueries({ queryKey: teamKeys.members(params.teamId) });
      toast.success('Users has been successfully invited');
      options.onSuccess && options.onSuccess();
    },
    onError: (error) => {
      toast.error(
        typeof error === 'string' ? error : 'An error ocurred when inviting users to team'
      );
    },
  });

  return { handleAddMembersToTeam, isAddMembersToTeamPending };
};

export const useDeleteTeamMutation = (options: { onSuccess?: () => void } = {}) => {
  const queryClient = useQueryClient();

  const { mutate: handleDeleteTeam, isPending: isDeleteTeamPending } = useMutation({
    mutationFn: deleteTeam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamKeys.myTeams });
      toast.success('Team has been successfully deleted');
      options.onSuccess && options.onSuccess();
    },
    onError: (error) => {
      toast.error(typeof error === 'string' ? error : 'An error ocurred when deleting team');
    },
  });

  return { handleDeleteTeam, isDeleteTeamPending };
};

export const useSearchByTeamNameQuery = (name: string) => {
  const { data, isLoading } = useQuery({
    queryKey: teamKeys.searchByName(name),
    queryFn: () => searchByTeamName(name),
    enabled: !!name,
  });

  return { searchedTeams: data || [], isSearchByTeamNameLoading: isLoading };
};
