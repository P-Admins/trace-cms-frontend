import { Link, useLocation, useParams, useSearchParams } from 'react-router-dom';
import { Button, Listbox, ListboxItem } from '@nextui-org/react';
import { useGetUserTeamsQuery } from '@/hooks/team';
import { useModal } from '@/hooks/useModal';
import { useAuth } from '@/hooks/useAuth';
import AddIcon from '@icons/Add.svg?react';
import AccountItem from '@components/layout/sidebar/AccountItem';
import TeamItem from '@components/layout/sidebar/TeamItem';

type Props = {
  className?: string;
};

export default function SettingSidebar({ className = '' }: Props) {
  const { createModalProps: createModal } = useModal();
  const { user } = useAuth();
  const { pathname } = useLocation();
  let [searchParams, setSearchParams] = useSearchParams();
  const teamId = searchParams.get('teamId');
  const { teams } = useGetUserTeamsQuery();
  const { tab } = useParams();

  return (
    <div className={`w-[330px] py-5 pl-[18px] overflow-y-auto scroll-auto ${className}`}>
      <h3 className="mt-32 ml-[22px]">Settings</h3>
      <div className="flex flex-col mt-10">
        <div>
          <h5 className="font-light ml-[22px] mb-4">Account</h5>
          <Link to="/settings/user">
            <AccountItem
              name={user?.name}
              avatarUrl={user?.profileImageSmallThumbnailUrl || undefined}
              showTopBorder={true}
              isActive={pathname.includes('/settings/user')}
            />
          </Link>
        </div>
        <div className="mt-[96px]">
          <h5 className="font-light ml-[22px] mb-4">Team</h5>
          <Listbox items={teams} className="p-0" classNames={{ list: 'gap-0' }}>
            {teams.map((item, index) => (
              <ListboxItem key={item.teamId} className="p-0 data-[hover=true]:bg-default-200">
                <Link to={`/settings/team/${tab}?teamId=${item.teamId}`}>
                  <TeamItem
                    showTopBorder={!index}
                    name={item.name}
                    profileImgSrc={item?.profileImageSmallThumbnailUrl || ''}
                    isActive={item.teamId === teamId}
                  />
                </Link>
              </ListboxItem>
            ))}
          </Listbox>
          <div className="border-b-1 border-default-900 border-opacity-10 ml-5 mr-5 py-[3px]">
            <Button
              size="lg"
              className="bg-transparent p-2"
              startContent={<AddIcon fill="black" height={16} width={16} />}
              onClick={createModal?.onOpen}
            >
              <span className="ml-3">Create New Team</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
