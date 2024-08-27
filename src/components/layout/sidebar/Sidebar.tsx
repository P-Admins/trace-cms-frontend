import { useEffect, useMemo } from 'react';
import { useModal } from '@/hooks/useModal';
import { useAuth } from '@/hooks/useAuth';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button } from '@nextui-org/react';
import { useGetUserTeamsQuery } from '@/hooks/team';
import SettingsIcon from '@icons/Settings.svg?react';
import TraceLogo from '@/assets/Trace_Logo_Black.png';
import ContentIcon from '@icons/Content.svg?react';
import AddIcon from '@icons/Add.svg?react';
import ChevronUpIcon from '@icons/ChevronUp.svg?react';
import SidebarItem from './SidebarItem';
import TextButton from '@/components/buttons/TextButton';
import CustomDropdown from '@/components/dropdown/CustomDropdown';
import SmallAvatar from '@/components/avatars/SmallAvatar';

type Props = {
  className?: string;
};

export default function Sidebar({ className = '' }: Props) {
  const navigate = useNavigate();
  const { user, workspace, setWorkspace, logout, isLoggingOut } = useAuth();
  const { createModalProps: createModal } = useModal();
  const { teams } = useGetUserTeamsQuery();
  const myWorkspace = { id: 'my-workspace', name: 'My Workspace', path: '/my-workspace' };
  const { teamId } = useParams();
  const { pathname } = useLocation();

  const dropdownItems = useMemo(() => {
    const items = [
      {
        id: 'my-workspace',
        icon: <SmallAvatar shape="square" name="My Workspace" size="md" />,
        text: 'My Workspace',
        onClick: () => {
          setWorkspace(myWorkspace);
          navigate('/my-workspace');
        },
      },
      ...(teams
        ? teams.map((team) => ({
            id: team.teamId,
            icon: (
              <SmallAvatar
                shape="square"
                name={team.name}
                src={team.profileImageSmallThumbnailUrl}
                size="md"
              />
            ),
            text: team.name,
            onClick: () => {
              setWorkspace({
                id: team.teamId,
                name: team.name,
                path: `/workspace/${team.teamId}`,
                src: team.profileImageSmallThumbnailUrl,
              });
              navigate(`/workspace/${team.teamId}`);
            },
          }))
        : []),
    ];
    return items;
  }, [teams]);

  useEffect(() => {
    if (pathname === '/my-workspace' && workspace?.id !== 'my-workspace') {
      setWorkspace(myWorkspace);
    } else if (teamId && workspace?.id !== teamId) {
      const team = teams.find((team) => team.teamId === teamId);
      if (team) {
        setWorkspace({
          id: team.teamId,
          name: team.name,
          path: `/workspace/${team.teamId}`,
          src: team.profileImageSmallThumbnailUrl,
        });
      }
    }
  }, [teams]);

  return (
    <div
      className={`flex flex-col justify-between bg-white/50 min-h-[calc(100%-40px)] w-[260px] rounded-[18px] gap-[35px] py-8 overflow-y-auto scroll-auto scroll ${className}`}
    >
      <div className="flex flex-col gap-y-4">
        <div className="px-8">
          <img src={TraceLogo} />
        </div>
        <SidebarItem onClick={() => navigate(workspace ? workspace.path : myWorkspace.path)}>
          <ContentIcon width={36} height={36} />
          <span className="font-extrabold">Content</span>
        </SidebarItem>
      </div>
      <div>
        <SidebarItem withBorder withPadding={false}>
          <Button
            size="lg"
            className="w-full px-8 py-5 h-auto rounded-none bg-transparent gap-6"
            startContent={<AddIcon fill="black" height={32} width={32} />}
            onClick={createModal?.onOpen}
          >
            <span className="ml-3">Create New Team</span>
          </Button>
        </SidebarItem>
        {teams.length ? (
          <SidebarItem withBorder withPadding={false} className="px-0 py-0">
            <CustomDropdown
              className="min-w-[260px]"
              placement="top-start"
              offset={0}
              dropdownTriggerChildren={
                <Button
                  className="w-full px-8 py-5 h-auto rounded-none bg-transparent gap-6"
                  startContent={
                    <SmallAvatar
                      shape="square"
                      name={workspace?.name}
                      src={workspace?.src}
                      size="md"
                    />
                  }
                >
                  <div className="flex w-full items-center justify-between ">
                    <span className="text-lg">{workspace?.name}</span>
                    <div className="-mr-3">
                      <ChevronUpIcon width={24} height={24} />
                    </div>
                  </div>
                </Button>
              }
              dropdownItems={dropdownItems}
            />
          </SidebarItem>
        ) : (
          <SidebarItem withBorder withPadding={false}>
            <Button
              className="w-full px-8 py-5 h-auto rounded-none bg-transparent gap-6"
              onClick={() => navigate('/my-workspace')}
              startContent={<SmallAvatar shape="square" name={workspace?.name} size="md" />}
            >
              <div className="flex w-full items-center">
                <span className="text-lg">{workspace?.name}</span>
              </div>
            </Button>
          </SidebarItem>
        )}
        <SidebarItem withPadding={false}>
          <Button
            startContent={
              <SmallAvatar
                showFallback
                shape="square"
                name={user?.name}
                src={user?.profileImageSmallThumbnailUrl}
                size="md"
              />
            }
            className="px-8 py-5 h-auto bg-transparent w-full"
            onClick={() => navigate('/settings/user')}
          >
            <span className="text-left text-nowrap text-ellipsis overflow-hidden ml-3 min-w-[108px] ">
              {user?.name}
            </span>
            <SettingsIcon width={24} height={24} className="-mr-1 shrink-0" />
          </Button>
        </SidebarItem>
        <div className="text-end">
          <TextButton
            className="text-sm text-default-700 mr-5 p-2"
            text="Sign out"
            onClick={logout}
            isLoading={isLoggingOut}
          />
        </div>
      </div>
    </div>
  );
}
